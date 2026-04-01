<?php

namespace BitApps\Assist\Update;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Hooks\Hooks;

/**
 * Fixes legacy update cache issues from old bit-assist-pro versions (<= 1.0.7).
 *
 * The old pro plugin stored update data under the key "../../index.php" instead
 * of "bit-assist-pro/index.php", causing updates to not display correctly.
 */
final class LegacyProUpdateCache
{
    private const PRO_BASENAME = 'bit-assist-pro/index.php';

    private const LEGACY_KEY = '../../index.php';

    private const MAX_AFFECTED_VERSION = '1.0.7';

    public function register()
    {
        if (!$this->isAffected()) {
            return;
        }

        Hooks::addFilter('site_transient_update_plugins', [$this, 'fixLegacyKey'], 0);
    }

    private function isAffected()
    {
        if (!\function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $plugins = get_plugins();
        $version = $plugins[self::PRO_BASENAME]['Version'] ?? null;

        return !empty($version) && version_compare($version, self::MAX_AFFECTED_VERSION, '<=');
    }

    public function fixLegacyKey($cacheData)
    {
        if (!\is_object($cacheData)) {
            return $cacheData;
        }


        foreach (['response', 'checked'] as $prop) {
            if (empty($cacheData->{$prop}) || !\is_array($cacheData->{$prop}) || !\array_key_exists(self::LEGACY_KEY, $cacheData->{$prop})) {
                continue;
            }

            // Copy to correct key if it doesn't exist
            if (!\array_key_exists(self::PRO_BASENAME, $cacheData->{$prop})) {
                $cacheData->{$prop}[self::PRO_BASENAME] = $cacheData->{$prop}[self::LEGACY_KEY];

                // Fix id and plugin fields
                if (\is_object($cacheData->{$prop}[self::PRO_BASENAME])) {
                    $cacheData->{$prop}[self::PRO_BASENAME]->id     = self::PRO_BASENAME;
                    $cacheData->{$prop}[self::PRO_BASENAME]->plugin = self::PRO_BASENAME;
                }
            }

            // Remove the legacy key
            unset($cacheData->{$prop}[self::LEGACY_KEY]);
        }

        return $cacheData;
    }
}
