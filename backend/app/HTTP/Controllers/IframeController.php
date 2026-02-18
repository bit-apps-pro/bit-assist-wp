<?php

namespace BitApps\Assist\HTTP\Controllers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

final class IframeController
{
    public function iframe(Request $request)
    {
        $validated = $request->validate([
            'clientDomain' => ['required', 'string', 'sanitize:text'],
        ]);

        $urlParts = explode('-protocol-bit-assist-', $validated['clientDomain']);
        $protocol = $urlParts[0] === 'i' ? 'http://' : 'https://';
        $domain = $urlParts[1];
        $clientDomain = $protocol . $domain;

        $version = Config::VERSION;
        $assetBase = Config::get('ROOT_URI') . '/iframe';
        $frameAncestor = Config::get('SITE_URL');
        if ($clientDomain !== $frameAncestor) {
            $frameAncestor .= ' ' . $clientDomain;
        }

        $locale = get_locale();
        $translations = $this->loadTranslations($locale);

        echo '<!DOCTYPE html>';
        echo '<html lang="' . esc_attr($locale) . '">';
        echo '<head>';
        echo '<meta charset="UTF-8" />';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
        echo '<title>' . esc_html__('Bit Assist Widget', 'bit-assist') . '</title>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet -- Iframe is standalone HTML, cannot use wp_enqueue_style.
        echo '<link rel="stylesheet" href="' . esc_url($assetBase . '/assets/index.css?ver=' . $version) . '">';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML; wp-i18n requires wp-hooks to fire gettext actions.
        echo '<script src="' . esc_url(includes_url('js/dist/hooks.min.js')) . '"></script>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML, cannot use wp_enqueue_script.
        echo '<script src="' . esc_url(includes_url('js/dist/i18n.min.js')) . '"></script>';
        echo '<script>wp.i18n.setLocaleData(' . wp_json_encode($translations) . ', "bit-assist");</script>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML, cannot use wp_enqueue_script.
        echo '<script src="' . esc_url($assetBase . '/assets/index.js?ver=' . $version) . '"></script>';
        echo '</head>';
        echo '<body>';
        echo '<div id="widgetWrapper" class="hide">';
        echo '<div id="contentWrapper" class="hide"></div>';
        echo '<div id="widgetBubbleRow">';
        echo '<div id="widgetBubbleWrapper">';
        echo '<button id="widgetBubble"><img alt="' . esc_attr__('Widget Icon', 'bit-assist') . '" id="widget-img" /></button>';
        echo '<span id="credit"><a href="https://www.bitapps.pro/bit-assist" rel="nofollow noreferrer noopener" target="_blank">' . esc_html__('by Bit Assist', 'bit-assist') . '</a></span>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo '</body>';
        echo '</html>';

        status_header(200);
        header('Content-Type: text/html');
        header('Content-Security-Policy: frame-ancestors ' . $frameAncestor);
        exit();
    }

    /**
     * Load JED locale data for the given locale from the plugin's languages directory.
     * Returns an empty array if no translation file exists (falls back to source strings).
     *
     * @param string $locale WordPress locale string, e.g. "bn_BD".
     *
     * @return array<string, mixed>
     */
    private function loadTranslations(string $locale): array
    {
        $jedFile = Config::get('BASEDIR_ROOT') . 'languages/bit-assist-' . $locale . '-bit-assist-widget-script-JAVASCRIPT-ASYNC.json';

        if (!file_exists($jedFile)) {
            return [];
        }

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $jed = json_decode($wp_filesystem->get_contents($jedFile), true);

        return $jed['locale_data']['bit-assist'] ?? [];
    }
}
