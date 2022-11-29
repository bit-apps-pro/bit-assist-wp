<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Config;

final class DownloadController
{
    public function downloadResponseFile()
    {
        $filePath = $this->isRequestedFileExists();
        $fileName = sanitize_file_name($_GET['fileName']);
        $isDownload = isset($_GET['download']);

        if ($filePath) {
            $this->fileDownloadORView($filePath, $fileName, $isDownload);
        } else {
            $this->show404();
        }
    }

    private function isRequestedFileExists()
    {
        if (!isset($_GET['widgetChannelID']) || !isset($_GET['fileID']) || !isset($_GET['fileName'])) {
            return false;
        }
        $widgetChannelID = intval(sanitize_text_field($_GET['widgetChannelID']));
        $fileID = sanitize_file_name($_GET['fileID']);
        $filePath = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelID . DIRECTORY_SEPARATOR . $fileID;
        if (is_readable($filePath)) {
            return $filePath;
        }
        return false;
    }

    private function fileDownloadORView($filePath, $fileName, $forceDownload = false)
    {
        if ($forceDownload) {
            header('Content-Type: application/force-download');
            header('Content-Type: application/octet-stream');
            header('Content-Type: application/download');
            header('Content-Disposition: attachment; filename="' . $fileName . '"');
        } else {
            $fileInfo = wp_check_filetype($filePath);
            $content_types = 'text/plain';
            if ($fileInfo['type'] && $fileInfo['ext']) {
                $content_types = $fileInfo['type'];
                $ext = $fileInfo['ext'];
                if (in_array($ext[1], ['txt', 'php', 'html', 'xhtml', 'json'])) {
                    $content_types = 'text/plain';
                }
            }
            header('Content-Disposition:filename="' . $fileName . '"');
            header("Content-Type: $content_types");
        }

        header('Content-Description: File Transfer');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        header('Content-Transfer-Encoding: binary ');
        flush();
        readfile($filePath);
        die();
    }

    private function show404()
    {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        get_template_part(404);
        exit();
    }
}
