<?php

namespace BitApps\Assist\HTTP\Controllers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

final class IframeController
{
    private const WIDGET_SCRIPT_HANDLE_SUFFIX = '-widget-script-JAVASCRIPT-ASYNC';

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

        status_header(200);
        header('Content-Type: text/html; charset=UTF-8');
        header('Content-Security-Policy: frame-ancestors ' . $frameAncestor);

        $translationScript = $this->getTranslationScript();

        echo '<!DOCTYPE html>';
        echo '<html lang="' . get_locale() . '">';
        echo '<head>';
        echo '<meta charset="UTF-8" />';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
        echo '<title>Bit Assist ' . esc_html__('Widget', 'bit-assist') . '</title>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet -- Iframe is standalone HTML, cannot use wp_enqueue_style.
        echo '<link rel="stylesheet" href="' . esc_url($assetBase . '/assets/index.css?ver=' . $version) . '">';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML; wp-i18n requires wp-hooks to fire gettext actions.
        echo '<script src="' . esc_url(includes_url('js/dist/hooks.min.js')) . '"></script>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML, cannot use wp_enqueue_script.
        echo '<script src="' . esc_url(includes_url('js/dist/i18n.min.js')) . '"></script>';
        if ($translationScript) {
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Translation script from wp_scripts()->print_translations
            echo '<script id="' . esc_attr(Config::SLUG . self::WIDGET_SCRIPT_HANDLE_SUFFIX . '-js-translations') . '">' . $translationScript . '</script>';
        }
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML, cannot use wp_enqueue_script.
        echo '<script src="' . esc_url($assetBase . '/assets/index.js?ver=' . $version) . '"></script>';
        echo '</head>';
        echo '<body>';
        echo '<div id="widgetWrapper" class="hide">';
        echo '<div id="contentWrapper" class="hide"></div>';
        echo '<div id="widgetBubbleRow">';
        echo '<div id="widgetBubbleWrapper">';
        echo '<button id="widgetBubble"><img alt="' . esc_attr__('Widget Icon', 'bit-assist') . '" id="widget-img" /></button>';
        echo '<span id="credit"><a href="https://www.bitapps.pro/bit-assist" rel="nofollow noreferrer noopener" target="_blank">' . esc_html__('by', 'bit-assist') . ' Bit Assist</a></span>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo '</body>';
        echo '</html>';

        exit();
    }

    /**
     * Loads widget script translations via wp_set_script_translations and returns
     * the inline script content for injection into the iframe head.
     */
    private function getTranslationScript()
    {
        $handle = Config::SLUG . self::WIDGET_SCRIPT_HANDLE_SUFFIX;
        $src = Config::get('ROOT_URI') . '/iframe/assets/index.js';

        wp_register_script($handle, $src, ['wp-i18n']);
        wp_set_script_translations($handle, 'bit-assist', Config::get('BASEDIR_ROOT') . 'languages');

        return wp_scripts()->print_translations($handle, false);
    }
}
