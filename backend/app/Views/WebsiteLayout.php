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
        $jsURI = Config::get('ASSET_JS_URI');

        wp_enqueue_script($slug . '-widget-script-DEFER-MODULE', $rootURL . '/client/build/bit-assist.js', [], $version, true);
    }

    /**
     * Modify style tags.
     *
     * @param string $html   link tag
     * @param mixed  $handle
     * @param mixed  $href
     *
     * @return string new link tag
     */
    public function linkTagFilter($html, $handle, $href)
    {
        $newTag = $html;
        if (str_contains($handle, 'PRECONNECT')) {
            $newTag = preg_replace('/rel=("|\')stylesheet("|\')/', 'rel="preconnect"', $newTag);
        }

        if (str_contains($handle, 'PRELOAD')) {
            $newTag = preg_replace('/rel=("|\')stylesheet("|\')/', 'rel="preload"', $newTag);
        }

        if (str_contains($handle, 'CROSSORIGIN')) {
            $newTag = preg_replace('/<link /', '<link crossorigin ', $newTag);
        }

        if (str_contains($handle, 'SCRIPT')) {
            $newTag = preg_replace('/<link /', '<link as="script" ', $newTag);
        }

        return $newTag;
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
        $newTag = $html;
        if (str_contains($handle, 'MODULE')) {
            $newTag = preg_replace('/<script /', '<script type="module" ', $newTag);
        }

        if (str_contains($handle, 'DEFER')) {
            $newTag = preg_replace('/<script /', '<script defer ', $newTag);
        }

        return $newTag;
    }
}
