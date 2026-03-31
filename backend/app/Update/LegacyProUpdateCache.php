<?php

namespace BitApps\Assist\Update;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Hooks\Hooks;

final class LegacyProUpdateCache
{
    private const LEGACY_PRO_UPDATE_KEY = '../../index.php';

    private const PRO_PLUGIN_BASENAME = 'bit-assist-pro/index.php';

    private const LAST_AFFECTED_PRO_VERSION = '1.0.7';

    private $_shouldRepairLegacyPath;

    public function register()
    {
        Hooks::addAction('admin_init', [$this, 'sync']);
        Hooks::addFilter('pre_set_site_transient_update_plugins', [$this, 'repair'], 999);
    }

    public function sync()
    {
        $updateCache = get_site_transient('update_plugins');

        if ($this->normalize($updateCache)) {
            set_site_transient('update_plugins', $updateCache);
        }
    }

    public function repair($cacheData)
    {
        $this->normalize($cacheData);

        return $cacheData;
    }

    private function normalize(&$cacheData)
    {
        if (!$this->shouldRepairLegacyPath() || !\is_object($cacheData)) {
            return false;
        }

        $isUpdated = false;

        foreach (['checked', 'response', 'no_update'] as $property) {
            if ($this->moveLegacyEntry($cacheData, $property)) {
                $isUpdated = true;
            }
        }

        if ($isUpdated) {
            $cacheData->last_checked = time();
        }

        return $isUpdated;
    }

    private function moveLegacyEntry(&$cacheData, $property)
    {
        if (empty($cacheData->{$property}) || !\is_array($cacheData->{$property})) {
            return false;
        }

        $isUpdated = false;

        if (!\array_key_exists(self::LEGACY_PRO_UPDATE_KEY, $cacheData->{$property})) {
            return false;
        }

        if (!\array_key_exists(self::PRO_PLUGIN_BASENAME, $cacheData->{$property})) {
            $cacheData->{$property}[self::PRO_PLUGIN_BASENAME] = $cacheData->{$property}[self::LEGACY_PRO_UPDATE_KEY];

            if (\is_object($cacheData->{$property}[self::PRO_PLUGIN_BASENAME])) {
                $cacheData->{$property}[self::PRO_PLUGIN_BASENAME]->id = self::PRO_PLUGIN_BASENAME;
                $cacheData->{$property}[self::PRO_PLUGIN_BASENAME]->plugin = self::PRO_PLUGIN_BASENAME;
            }
        }

        unset($cacheData->{$property}[self::LEGACY_PRO_UPDATE_KEY]);
        $isUpdated = true;

        return $isUpdated;
    }

    private function shouldRepairLegacyPath()
    {
        if (!\is_null($this->_shouldRepairLegacyPath)) {
            return $this->_shouldRepairLegacyPath;
        }

        if (!\function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $installedPlugins = get_plugins();
        $installedVersion = $installedPlugins[self::PRO_PLUGIN_BASENAME]['Version'] ?? null;

        $this->_shouldRepairLegacyPath = !empty($installedVersion)
            && version_compare($installedVersion, self::LAST_AFFECTED_PRO_VERSION, '<');

        return $this->_shouldRepairLegacyPath;
    }
}
