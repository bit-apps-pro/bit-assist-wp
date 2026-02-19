<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Migration\Migration;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Migration class follows framework naming convention
final class BASTUpdateOptions extends Migration
{
    public function up()
    {
        Config::updateOption('db_version', Config::DB_VERSION, true);
        Config::updateOption('version', Config::VERSION, true);
    }

    public function down()
    {
    }
}
