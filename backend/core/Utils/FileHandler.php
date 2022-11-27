<?php
namespace BitApps\Assist\Core\Utils;

use BitApps\Assist\Config;

final class FileHandler
{
    public function rmrf($dir)
    {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != '.' && $object != '..') {
                    if (is_dir($dir . DIRECTORY_SEPARATOR . $object) && !is_link($dir . DIRECTORY_SEPARATOR . $object)) {
                        $this->rmrf($dir . DIRECTORY_SEPARATOR . $object);
                    } else {
                        unlink($dir . DIRECTORY_SEPARATOR . $object);
                    }
                }
            }
            rmdir($dir);
        } else {
            unlink($dir);
        }
    }

    public function cpyr($source, $destination)
    {
        if (is_dir($source)) {
            mkdir($destination);
            // chmod($destination, 0744);
            $objects = scandir($source);
            foreach ($objects as $object) {
                if ($object != '.' && $object != '..') {
                    if (is_dir($source . DIRECTORY_SEPARATOR . $object) && !is_link($source . DIRECTORY_SEPARATOR . $object)) {
                        cpyr($source . DIRECTORY_SEPARATOR . $object, $destination . DIRECTORY_SEPARATOR . $object);
                    } elseif (is_file($source . DIRECTORY_SEPARATOR . $object)) {
                        copy($source . DIRECTORY_SEPARATOR . $object, $destination . DIRECTORY_SEPARATOR . $object);
                    // chmod($destination. DIRECTORY_SEPARATOR .$object, 0644);
                    } else {
                        symlink($source . DIRECTORY_SEPARATOR . $object, $destination . DIRECTORY_SEPARATOR . $object);
                    }
                }
            }
        } else {
            copy($source, $destination);
        }
    }

    public function moveUploadedFiles($fileDetails, $widgetChannelId, $entryId)
    {
        $file_upoalded = [];
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelId . DIRECTORY_SEPARATOR . $entryId;
        wp_mkdir_p($_upload_dir);
        if (is_array($fileDetails['name'])) {
            foreach ($fileDetails['name'] as $key => $value) {
                //check accepted filetype in_array($fileDetails['name'][$key], $supported_files) else \
                if (!empty($value)) {
                    $fileNameCount = 1;
                    // $file_upoalded[$key] = time()."_$value";
                    $file_upoalded[$key] = sanitize_file_name($value);
                    while (file_exists($_upload_dir . DIRECTORY_SEPARATOR . $file_upoalded[$key])) {
                        $file_upoalded[$key] = sanitize_file_name(preg_replace('/(.[a-z A-Z 0-9]+)$/', "__{$fileNameCount}$1", $value));
                        $fileNameCount = $fileNameCount + 1;
                        if ($fileNameCount === 11) {
                            break;
                        }
                    }
                    $move_status = \move_uploaded_file($fileDetails['tmp_name'][$key], $_upload_dir . DIRECTORY_SEPARATOR . $file_upoalded[$key]);
                    if (!$move_status) {
                        unset($file_upoalded[$key]);
                    }
                }
            }
        } else {
            if (!empty($fileDetails['name'])) {
                $fileNameCount = 1;
                $file_upoalded[0] = sanitize_file_name($fileDetails['name']);
                while (file_exists($_upload_dir . DIRECTORY_SEPARATOR . $file_upoalded[0])) {
                    $file_upoalded[0] = sanitize_file_name(preg_replace('/(.[a-z A-Z 0-9]+)$/', "__{$fileNameCount}$1", $fileDetails['name']));
                    $fileNameCount = $fileNameCount + 1;
                    if ($fileNameCount === 11) {
                        break;
                    }
                }
                $move_status = \move_uploaded_file($fileDetails['tmp_name'], $_upload_dir . DIRECTORY_SEPARATOR . $file_upoalded[0]);
                if (!$move_status) {
                    unset($file_upoalded[0]);
                }
            }
        }
        return $file_upoalded;
    }

    public function deleteFiles($widgetChannelId, $entryId, $files)
    {
        $_upload_dir = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelId . DIRECTORY_SEPARATOR . $entryId;
        foreach ($files as $name) {
            unlink($_upload_dir . DIRECTORY_SEPARATOR . $name);
        }
    }
}
