<?php

namespace BitApps\Assist\HTTP\Controllers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Assist\Model\Widget;

final class IframeController
{
    private const WIDGET_SCRIPT_HANDLE_SUFFIX = '-widget-script-JAVASCRIPT-ASYNC';

    public function iframe(Request $request)
    {
        $validated = $request->validate([
            'clientDomain' => ['required', 'string', 'sanitize:text'],
        ]);

        $clientDomain = $this->parseClientDomain($validated['clientDomain']);

        // Only serve the widget shell to domains that actually have an active widget
        // (the site itself, or an external domain resolved by Pro). Anything else
        // must not be allowed to frame this page.
        if (\is_null($clientDomain) || !$this->hasWidgetForDomain($clientDomain)) {
            status_header(404);
            header('Content-Security-Policy: frame-ancestors \'none\'');
            header('X-Frame-Options: DENY');

            exit();
        }

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

        // The iframe must only ever talk to this site's own API. It is emitted
        // server-side so it can't be overridden by a postMessage from the parent.
        $iframeConfig = [
            'apiEndPoint'  => Config::get('API_URL')['base'],
            'clientDomain' => $clientDomain,
        ];

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

        $iframeConfigJson = wp_json_encode($iframeConfig, JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
        echo '<script id="' . esc_attr(Config::SLUG . '-iframe-config') . '">';
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON encoded with JSON_HEX_TAG, safe inside <script>.
        echo 'window.bitAssistIframeConfig = ' . $iframeConfigJson . ';';
        echo '</script>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Iframe is standalone HTML, cannot use wp_enqueue_script.
        echo '<script src="' . esc_url($assetBase . '/assets/index.js?ver=' . $version) . '"></script>';
        echo '</head>';
        echo '<body>';
        echo '<div id="widgetWrapper" class="hide">';
        echo '<div id="contentWrapper" class="hide"></div>';
        echo '<div id="widgetBubbleRow">';
        echo '<div id="widgetBubbleWrapper">';
        echo '<button id="widgetBubble"><img alt="' . esc_attr__('Widget Icon', 'bit-assist') . '" id="widget-img" /></button>';
        echo '<span id="credit"><a href="https://www.bitapps.pro/bit-assist" rel="nofollow noreferrer noopener" target="_blank">' . esc_html(\sprintf(
            // translators: %s: Brand name (Bit Assist)
            __('by %s', 'bit-assist'),
            'Bit Assist'
        )) . '</a></span>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo '</body>';
        echo '</html>';

        exit();
    }

    /**
     * Converts the "<s|i>-protocol-bit-assist-<host[:port]>" query value into an origin.
     * Returns null when the value is malformed, so nothing unexpected can reach the CSP header.
     *
     * @param string $value
     *
     * @return null|string
     */
    private function parseClientDomain($value)
    {
        $urlParts = explode('-protocol-bit-assist-', (string) $value, 2);

        if (\count($urlParts) !== 2 || !\in_array($urlParts[0], ['i', 's'], true)) {
            return null;
        }

        $domain = strtolower($urlParts[1]);

        if (!preg_match('/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*(:\d{1,5})?$/', $domain)) {
            return null;
        }

        return ($urlParts[0] === 'i' ? 'http://' : 'https://') . $domain;
    }

    /**
     * Whether an active widget is configured for the given origin. Uses the same
     * lookup as the widget API: the site itself, or an external domain via Pro.
     *
     * @param string $clientDomain
     *
     * @return bool
     */
    private function hasWidgetForDomain($clientDomain)
    {
        $widget = new Widget();
        $widget->where('status', 1);

        if (Config::get('SITE_URL') === $clientDomain) {
            $widget->where('active', 1);
        } else {
            $widget = Hooks::applyFilter(Config::withPrefix('resolve_external_widget'), null, $clientDomain, $widget);

            if (\is_null($widget)) {
                return false;
            }
        }

        $widget->take(1)->get(['id']);

        return isset($widget->id);
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
