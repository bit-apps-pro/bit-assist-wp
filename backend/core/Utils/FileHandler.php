<?php
namespace BitApps\Assist\Core\Utils;

use BitApps\Assist\Config;

final class FileHandler
{
    public function moveUploadedFiles($fileDetails, $widgetChannelID)
    {
        $file_uploaded = [];
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;
        wp_mkdir_p($_upload_dir);
        if (is_array($fileDetails['name'])) {
            foreach ($fileDetails['name'] as $key => $value) {
                if (!empty($value)) {
                    $fileNameCount = 1;
                    $file_uploaded[$key] = sanitize_file_name($value);
                    while (file_exists($_upload_dir . DIRECTORY_SEPARATOR . $file_uploaded[$key])) {
                        $file_uploaded[$key] = sanitize_file_name(preg_replace('/(.[a-z A-Z 0-9]+)$/', "__{$fileNameCount}$1", $value));
                        $fileNameCount = $fileNameCount + 1;
                        if ($fileNameCount === 11) {
                            break;
                        }
                    }
                    $move_status = \move_uploaded_file($fileDetails['tmp_name'][$key], $_upload_dir . DIRECTORY_SEPARATOR . $file_uploaded[$key]);
                    if (!$move_status) {
                        unset($file_uploaded[$key]);
                    }
                }
            }
        } else {
            if (!empty($fileDetails['name'])) {
                $fileNameCount = 1;
                $file_uploaded[0] = sanitize_file_name($fileDetails['name']);
                while (file_exists($_upload_dir . DIRECTORY_SEPARATOR . $file_uploaded[0])) {
                    $file_uploaded[0] = sanitize_file_name(preg_replace('/(.[a-z A-Z 0-9]+)$/', "__{$fileNameCount}$1", $fileDetails['name']));
                    $fileNameCount = $fileNameCount + 1;
                    if ($fileNameCount === 11) {
                        break;
                    }
                }
                $move_status = \move_uploaded_file($fileDetails['tmp_name'], $_upload_dir . DIRECTORY_SEPARATOR . $file_uploaded[0]);
                if (!$move_status) {
                    unset($file_uploaded[0]);
                }
            }
        }
        return $file_uploaded;
    }

    public function deleteFiles($widgetChannelID, $files)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID;
        foreach ($files as $name) {
            unlink($_upload_dir . DIRECTORY_SEPARATOR . $name);
        }
    }
}
