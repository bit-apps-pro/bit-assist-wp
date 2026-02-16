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

        echo '<!DOCTYPE html>';
        echo '<html lang="en">';
        echo '<head>';
        echo '<meta charset="UTF-8" />';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
        echo '<title>' . esc_html__('Bit Assist Widget', 'bit-assist') . '</title>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- It can be outside of WordPress environment, so we can't rely on wp_enqueue_script.
        echo '<script crossorigin src="' . esc_url($assetBase . '/assets/index.js?ver=' . $version) . '"></script>';
        // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet -- It can be outside of WordPress environment, so we can't rely on wp_enqueue_style.
        echo '<link rel="stylesheet" href="' . esc_url($assetBase . '/assets/index.css?ver=' . $version) . '">';
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
}
