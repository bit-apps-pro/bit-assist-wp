<?php

namespace BitApps\Assist\Views;

use BitApps\Assist\Config;
use BitApps\Assist\Core\Hooks\Hooks;

class WebsiteLayout
{
    public function __construct()
    {
        Hooks::addAction('wp_enqueue_scripts', [$this, 'head'], 0);
        Hooks::addFilter('script_loader_tag', [$this, 'scriptTagFilter'], 0, 3);
    }

    /**
     * Load the asset libraries.
     *
     * @param string $currentScreen $top_level_page variable for current page
     */
    public function head($currentScreen)
    {
        $slug = Config::SLUG;
        $version = Config::VERSION;
        $rootURL = Config::get('ROOT_URI');

        wp_enqueue_script($slug . '-widget-script-DEFER-MODULE', $rootURL . '/iframe/bit-assist.js', [], $version, true);
        wp_localize_script($slug . '-widget-script-DEFER-MODULE', Config::VAR_PREFIX, [
            'host' => Config::get('ROOT_URI'),
            'api'  => Config::get('API_URL'),
        ]);
    }

    /**
     * Modify script tags.
     *
     * @param string $html   script tag
     * @param mixed  $handle
     * @param mixed  $href
     *
     * @return string new script tag
     */
    public function scriptTagFilter($html, $handle, $href)
    {
        $slug = Config::SLUG;
        $newTag = $html;
        if (strpos($handle, 'MODULE') !== false && strpos($handle, $slug) !== false) {
            $newTag = preg_replace('/<script /', '<script type="module" ', $newTag);
        }

        if (strpos($handle, 'DEFER') !== false && strpos($handle, $slug) !== false) {
            $newTag = preg_replace('/<script /', '<script defer ', $newTag);
        }

        return $newTag;
    }
}
