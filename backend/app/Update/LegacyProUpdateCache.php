<?php

namespace BitApps\Assist\Update;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Hooks\Hooks;

/**
 * Fixes legacy update cache issues from old bit-assist-pro versions (< 1.0.8).
 *
 * The old pro plugin stored update data under the key "../../index.php" instead
 * of "bit-assist-pro/index.php", causing updates to not display correctly.
 */
final class LegacyProUpdateCache
{
    private const PRO_BASENAME = 'bit-assist-pro/index.php';

    private const LEGACY_KEY = '../../index.php';

    private static $migrated = false;

    private static $installedVersion;

    public function register()
    {
        Hooks::addFilter('pre_set_site_transient_update_plugins', [$this, 'fixTransient'], 999);
        Hooks::addFilter('site_transient_update_plugins', [$this, 'fixTransient'], 0);
        Hooks::addAction('admin_init', [$this, 'migrateTransientKeys'], 0);
    }

    public function fixTransient($cacheData)
    {
        if (!\is_object($cacheData)) {
            return $cacheData;
        }

        $this->normalizeLegacyKeys($cacheData);
        $this->removeStaleUpdateEntry($cacheData);

        return $cacheData;
    }

    public function migrateTransientKeys()
    {
        if (self::$migrated) {
            return;
        }

        self::$migrated = true;

        $cache = get_site_transient('update_plugins');

        if (!\is_object($cache) || !$this->hasLegacyKey($cache)) {
            return;
        }

        $this->normalizeLegacyKeys($cache);
        $this->removeStaleUpdateEntry($cache);

        delete_site_transient('update_plugins');
        set_site_transient('update_plugins', $cache);
    }

    private function hasLegacyKey($cacheData)
    {
        foreach (['checked', 'response', 'no_update'] as $prop) {
            if (!empty($cacheData->{$prop}) && \is_array($cacheData->{$prop}) && \array_key_exists(self::LEGACY_KEY, $cacheData->{$prop})) {
                return true;
            }
        }

        return false;
    }

    private function normalizeLegacyKeys($cacheData)
    {
        foreach (['checked', 'response', 'no_update'] as $prop) {
            if (empty($cacheData->{$prop}) || !\is_array($cacheData->{$prop}) || !\array_key_exists(self::LEGACY_KEY, $cacheData->{$prop})) {
                continue;
            }

            if (!\array_key_exists(self::PRO_BASENAME, $cacheData->{$prop})) {
                $cacheData->{$prop}[self::PRO_BASENAME] = $cacheData->{$prop}[self::LEGACY_KEY];
            }

            if (\is_object($cacheData->{$prop}[self::PRO_BASENAME])) {
                $cacheData->{$prop}[self::PRO_BASENAME]->id     = self::PRO_BASENAME;
                $cacheData->{$prop}[self::PRO_BASENAME]->plugin = self::PRO_BASENAME;
            }

            unset($cacheData->{$prop}[self::LEGACY_KEY]);
        }
    }

    private function removeStaleUpdateEntry($cacheData)
    {
        if (empty($cacheData->response) || !\is_array($cacheData->response) || !\array_key_exists(self::PRO_BASENAME, $cacheData->response)) {
            return;
        }

        $updateInfo = $cacheData->response[self::PRO_BASENAME];
        $newVersion = \is_object($updateInfo) ? ($updateInfo->new_version ?? null) : null;

        if (empty($newVersion)) {
            return;
        }

        $installedVersion = $this->getInstalledVersion();

        if (!empty($installedVersion) && version_compare($installedVersion, $newVersion, '>=')) {
            unset($cacheData->response[self::PRO_BASENAME]);
        }
    }

    private function getInstalledVersion()
    {
        if (self::$installedVersion !== null) {
            return self::$installedVersion;
        }

        if (!\function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $plugins = get_plugins();
        self::$installedVersion = $plugins[self::PRO_BASENAME]['Version'] ?? false;

        return self::$installedVersion;
    }
}
