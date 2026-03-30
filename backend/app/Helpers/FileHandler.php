<?php

namespace BitApps\Assist\Helpers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;

final class FileHandler
{
    public function moveUploadedFiles($fileDetails, $widgetChannelID)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;

        wp_mkdir_p($_upload_dir);

        if (!$this->isUploadDir($_upload_dir)) {
            return [];
        }

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
}
