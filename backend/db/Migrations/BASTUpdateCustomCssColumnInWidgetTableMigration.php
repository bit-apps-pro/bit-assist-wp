<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Migration\Migration;

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Migration class follows framework naming convention
final class BASTUpdateCustomCssColumnInWidgetTableMigration extends Migration
{
    public function up()
    {
        // Schema::edit('widgets', function (Blueprint $table) {
        //     $table->longtext('custom_css')->nullable()->change();
        // });

        global $wpdb;
        $table_name = Config::withDBPrefix('widgets');
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Table name from trusted Config class, ALTER TABLE cannot use prepared statements
        $sql = "ALTER TABLE {$table_name} MODIFY COLUMN custom_css LONGTEXT NULL;";
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Table name from trusted Config class, ALTER TABLE cannot use prepared statements, direct DB query required for migration
        $wpdb->query($sql);
    }

    public function down()
    {
        // Schema::edit('widgets', function (Blueprint $table) {
        //     $table->string('custom_css')->nullable()->change();
        // });

        global $wpdb;
        $table_name = Config::withDBPrefix('widgets');
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Table name from trusted Config class, ALTER TABLE cannot use prepared statements
        $sql = "ALTER TABLE {$table_name} MODIFY COLUMN custom_css VARCHAR(255) NULL;";
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, PluginCheck.Security.DirectDB.UnescapedDBParameter, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Table name from trusted Config class, ALTER TABLE cannot use prepared statements, direct DB query required for migration
        $wpdb->query($sql);
    }
}
