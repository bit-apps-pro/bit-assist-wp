<?php

use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTAnalyticsTableMigration extends Migration
{
    public function up()
    {
        Schema::create('analytics', function (Blueprint $table) {
            $table->bigint('widget_id', 20)->unsigned()->foreign('widgets', 'id')->onDelete()->cascade();
            $table->bigint('channel_id', 20)->nullable()->unsigned()->foreign('widget_channels', 'id')->onDelete()->cascade();
            $table->tinyint('is_clicked')->defaultValue(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('analytics');
    }
}
