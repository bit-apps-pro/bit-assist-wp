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
        'js', 'mjs', 'cjs', 'html', 'htm', 'xhtml', 'shtml', 'svg', 'svgz',
        'htaccess', 'htpasswd', 'ini',
    ];

    public function moveUploadedFiles($fileDetails, $widgetChannelID)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;

        wp_mkdir_p($_upload_dir);

        if (!$this->isUploadDir($_upload_dir)) {
            return [];
        }

        $this->protectUploadDir(Config::get('UPLOAD_DIR'));
        $this->protectUploadDir($_upload_dir);

        $file_uploaded = [];

        if (\is_array($fileDetails['name'])) {
            foreach ($fileDetails['name'] as $key => $fileName) {
                $fileData = $this->saveFile($_upload_dir, $fileDetails['tmp_name'][$key], $fileName);
                if ($fileData) {
                    $file_uploaded[$key] = $fileData;
                }
            }
        } else {
            $fileData = $this->saveFile($_upload_dir, $fileDetails['tmp_name'], $fileDetails['name']);
            if ($fileData) {
                $file_uploaded[0] = $fileData;
            }
        }

        return $file_uploaded;
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

    private function saveFile($_upload_dir, $tmpName, $fileName)
    {
        if (empty($fileName)) {
            return false;
        }

        if (!$this->isAllowedUpload($tmpName, $fileName)) {
            return false;
        }

        $uniqueFileName = wp_generate_uuid4();
        $file_uploaded = ['uniqueName' => $uniqueFileName, 'originalName' => $fileName];

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $destination = $_upload_dir . DIRECTORY_SEPARATOR . $uniqueFileName;
        $move_status = $wp_filesystem->move($tmpName, $destination, true);
        if (!$move_status) {
            return false;
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

        $extension = strtolower((string) pathinfo($fileName, PATHINFO_EXTENSION));
        if ($extension === '' || \in_array($extension, self::BLOCKED_EXTENSIONS, true)) {
            return false;
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
            $properExt = strtolower((string) pathinfo($checked['proper_filename'], PATHINFO_EXTENSION));
            if ($properExt !== '' && \in_array($properExt, self::BLOCKED_EXTENSIONS, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Drops access-protection files into the upload directory so stored files
     * cannot be requested directly (downloads are served via DownloadController)
     * and no script can be executed from within the uploads path.
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
