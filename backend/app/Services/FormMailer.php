<?php

namespace BitApps\Assist\Services;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Helpers\FileHandler;
use Exception;

final class FormMailer
{
    private array $attachmentNames = [];

    public function send(string $email, string $formTitle, array $formData, array $storedFiles, $widgetChannelId): void
    {
        if (!is_email($email)) {
            return;
        }

        $email           = sanitize_email($email);
        $widgetChannelId = (int) $widgetChannelId;
        $subject         = $formTitle . ' ' . __('Submitted', 'bit-assist');
        $attachmentPaths = $this->resolveAttachments($storedFiles, $widgetChannelId);
        $displayData     = array_merge($formData, $storedFiles);

        add_filter('wp_mail_content_type', [$this, 'htmlContentType']);
        add_action('phpmailer_init', [$this, 'renameAttachments']);

        try {
            wp_mail($email, $subject, $this->buildEmailBody($displayData, $subject), [], $attachmentPaths);
        } finally {
            remove_filter('wp_mail_content_type', [$this, 'htmlContentType']);
            remove_action('phpmailer_init', [$this, 'renameAttachments']);
            $this->attachmentNames = [];
        }
    }

    public function htmlContentType(): string
    {
        return 'text/html';
    }

    public function renameAttachments($phpmailer): void
    {
        $phpmailer->clearAttachments();

        foreach ($this->attachmentNames as $path => $name) {
            try {
                $phpmailer->addAttachment($path, $name);
            } catch (Exception $e) {
                // unreadable file — skip rather than abort email
            }
        }
    }

    private function resolveAttachments(array $storedFiles, int $widgetChannelId): array
    {
        $uploadDir   = Config::get('UPLOAD_DIR') . DIRECTORY_SEPARATOR . $widgetChannelId;
        $fileHandler = new FileHandler();
        $paths       = [];

        foreach ($storedFiles as $fileInfo) {
            foreach ($this->normalizeFileEntries($fileInfo) as $file) {
                $path = $uploadDir . DIRECTORY_SEPARATOR . $file['uniqueName'];

                if (is_file($path) && $fileHandler->isUploadDir(dirname($path))) {
                    $paths[]                      = $path;
                    $this->attachmentNames[$path] = $file['originalName'] ?? basename($path);
                }
            }
        }

        return $paths;
    }

    private function buildEmailBody(array $formData, string $subject): string
    {
        $html = '<h2>' . esc_html($subject) . '</h2>';

        foreach ($formData as $key => $value) {
            $label = '<strong>' . esc_html($key) . '</strong>';

            if (\is_array($value)) {
                $names = array_filter(array_column($this->normalizeFileEntries($value), 'originalName'));

                if ($names) {
                    $suffix = \count($names) === 1
                        ? __('see attachment to download', 'bit-assist')
                        : __('see attachments', 'bit-assist');

                    $html .= '<p>' . $label . ': '
                        . implode(', ', array_map('esc_html', $names))
                        . ' <em>' . esc_html($suffix) . '</em></p>';
                }
            } else {
                $html .= '<p>' . $label . ': ' . esc_html($value) . '</p>';
            }
        }

        return $html;
    }

    private function normalizeFileEntries($fileInfo): array
    {
        if (!\is_array($fileInfo)) {
            return [];
        }
        return isset($fileInfo['uniqueName']) ? [$fileInfo] : array_values($fileInfo);
    }
}
