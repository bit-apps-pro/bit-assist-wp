<?php

namespace BitApps\Assist\Helpers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;

final class FileHandler
{
    /**
     * File extensions that must never be stored, even if a MIME lookup
     * would otherwise allow them. Defense-in-depth on top of the WordPress
     * allowed-mime allowlist.
     *
     * @var string[]
     */
    private const BLOCKED_EXTENSIONS = [
        'php', 'phtml', 'phps', 'php3', 'php4', 'php5', 'php7', 'php8', 'pht', 'phar',
        'exe', 'com', 'bat', 'cmd', 'msi', 'scr', 'dll',
        'sh', 'bash', 'zsh', 'ksh', 'cgi', 'pl', 'py', 'rb',
        'asp', 'aspx', 'jsp', 'jspx',
        'js', 'mjs', 'cjs', 'html', 'htm', 'xhtml', 'shtml', 'svgz',
        'htaccess', 'htpasswd', 'ini',
    ];

    /**
     * Original names of files that failed validation or could not be saved.
     * Empty file slots (no file chosen) are not counted as rejections.
     *
     * @var string[]
     */
    private $rejectedFiles = [];

    public function moveUploadedFiles($fileDetails, $widgetChannelID)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;

        wp_mkdir_p($_upload_dir);

        if (!$this->isUploadDir($_upload_dir)) {
            $this->rejectFiles($fileDetails);

            return [];
        }

        $this->protectUploadDir(Config::get('UPLOAD_DIR'));
        $this->protectUploadDir($_upload_dir);

        $file_uploaded = [];

        if (\is_array($fileDetails['name'])) {
            foreach ($fileDetails['name'] as $key => $fileName) {
                if (empty($fileName)) {
                    continue;
                }
                $fileData = $this->saveFile($_upload_dir, $fileDetails['tmp_name'][$key], $fileName);
                if ($fileData) {
                    $file_uploaded[$key] = $fileData;
                } else {
                    $this->rejectedFiles[] = $fileName;
                }
            }
        } elseif (!empty($fileDetails['name'])) {
            $fileData = $this->saveFile($_upload_dir, $fileDetails['tmp_name'], $fileDetails['name']);
            if ($fileData) {
                $file_uploaded[0] = $fileData;
            } else {
                $this->rejectedFiles[] = $fileDetails['name'];
            }
        }

        return $file_uploaded;
    }

    /**
     * @return string[]
     */
    public function getRejectedFiles(): array
    {
        return $this->rejectedFiles;
    }

    public function isUploadDir($filePath)
    {
        $resolvedUploadsDir = realpath(Config::get('UPLOAD_DIR'));
        if ($resolvedUploadsDir === false) {
            return false;
        }
        $uploadsDir = trailingslashit(wp_normalize_path($resolvedUploadsDir));

        $resolvedPath = realpath($filePath);
        if ($resolvedPath === false) {
            return false;
        }
        $realPath = trailingslashit(wp_normalize_path($resolvedPath));

        return strpos($realPath, $uploadsDir) === 0;
    }

    public function deleteFiles($widgetChannelID, $files)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;
        foreach ($files as $name) {
            wp_delete_file($_upload_dir . DIRECTORY_SEPARATOR . $name);
        }
    }

    /**
     * Marks every non-empty file slot as rejected (used when the upload
     * directory itself is unusable and nothing can be saved).
     *
     * @param mixed $fileDetails
     */
    private function rejectFiles($fileDetails): void
    {
        $names = \is_array($fileDetails['name']) ? $fileDetails['name'] : [$fileDetails['name']];
        foreach ($names as $fileName) {
            if (!empty($fileName)) {
                $this->rejectedFiles[] = $fileName;
            }
        }
    }

    private function saveFile($_upload_dir, $tmpName, $fileName)
    {
        if (empty($fileName)) {
            return false;
        }

        if (!$this->isAllowedUpload($tmpName, $fileName)) {
            return false;
        }

        $sanitizedSvg = null;
        if ($this->getExtension($fileName) === 'svg') {
            $sanitizedSvg = SvgSanitizer::sanitize((string) file_get_contents($tmpName));
            if ($sanitizedSvg === null) {
                return false;
            }
        }

        $uniqueFileName = wp_generate_uuid4();
        $file_uploaded = ['uniqueName' => $uniqueFileName, 'originalName' => $fileName];

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $destination = $_upload_dir . DIRECTORY_SEPARATOR . $uniqueFileName;
        if ($sanitizedSvg !== null) {
            // Store the sanitized markup, never the raw upload.
            if (!$wp_filesystem->put_contents($destination, $sanitizedSvg)) {
                return false;
            }
            wp_delete_file($tmpName);
        } else {
            $move_status = $wp_filesystem->move($tmpName, $destination, true);
            if (!$move_status) {
                return false;
            }
        }

        return $file_uploaded;
    }

    /**
     * Validates an uploaded file before it is stored.
     *
     * Rejects anything that is not a genuine PHP upload, exceeds the server
     * upload limit, resolves to a disallowed/executable type, or whose real
     * content does not match a WordPress-allowed MIME type.
     *
     * @param string $tmpName  Temporary upload path (raw $_FILES tmp_name)
     * @param string $fileName Client-supplied file name
     */
    private function isAllowedUpload($tmpName, $fileName): bool
    {
        if (empty($tmpName) || !is_uploaded_file($tmpName)) {
            return false;
        }

        $size = filesize($tmpName);
        if ($size === false || $size <= 0 || $size > wp_max_upload_size()) {
            return false;
        }

        $extension = $this->getExtension($fileName);
        if ($extension === '' || \in_array($extension, self::BLOCKED_EXTENSIONS, true)) {
            return false;
        }

        // SVG is not in the WordPress allowed-MIME list; it is validated and
        // rewritten by SvgSanitizer in saveFile() instead.
        if ($extension === 'svg') {
            return true;
        }

        // Validate the real file contents against the WordPress allowlist.
        // For images/media this sniffs actual bytes, blocking mislabeled files.
        $checked = wp_check_filetype_and_ext($tmpName, $fileName);
        if (empty($checked['ext']) || empty($checked['type'])) {
            return false;
        }

        // If WordPress detected a safer/different real name (content mismatch),
        // ensure that corrected extension is also not blocked.
        if (!empty($checked['proper_filename'])) {
            $properExt = $this->getExtension($checked['proper_filename']);
            if ($properExt !== '' && \in_array($properExt, self::BLOCKED_EXTENSIONS, true)) {
                return false;
            }
        }

        return true;
    }

    private function getExtension($fileName): string
    {
        return strtolower((string) pathinfo($fileName, PATHINFO_EXTENSION));
    }

    /**
     * Drops access-protection files into the upload directory so stored files
     * cannot be requested directly (downloads are served via DownloadController)
     * and no script can be executed from within the uploads path.
     *
     * @param mixed $dir
     */
    private function protectUploadDir($dir): void
    {
        $htaccess = $dir . DIRECTORY_SEPARATOR . '.htaccess';
        if (!file_exists($htaccess)) {
            $rules = "# Bit Assist: deny direct access to uploaded files\n"
                . "<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n"
                . "<IfModule !mod_authz_core.c>\n    Order allow,deny\n    Deny from all\n</IfModule>\n"
                . "php_flag engine off\n";
            @file_put_contents($htaccess, $rules);
        }

        $indexFile = $dir . DIRECTORY_SEPARATOR . 'index.html';
        if (!file_exists($indexFile)) {
            @file_put_contents($indexFile, '');
        }
    }
}
