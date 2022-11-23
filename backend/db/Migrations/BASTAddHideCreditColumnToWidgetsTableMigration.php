<?php

use BitApps\Assist\Config;
use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTAddHideCreditColumnToWidgetsTableMigration extends Migration
{
    public function up()
    {
        if (version_compare('1.0.1', Config::getOption('db_version'), '>')) {
            Schema::edit('widgets', function (Blueprint $table) {
                $table->boolean('hide_credit')->defaultValue(0);
            });
        }
    }

    public function down()
    {
        if (version_compare('1.0.1', Config::getOption('db_version'), '>')) {
            Schema::edit('widgets', function (Blueprint $table) {
                $table->dropColumn('hide_credit');
            });
        }
    }
}
