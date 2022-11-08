<?php

use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTWidgetChannelsTableMigration extends Migration
{
    public function up()
    {
        Schema::create('widget_channels', function (Blueprint $table) {
            $table->id();
            $table->bigint('widget_id', 20)->unsigned()->foreign('widgets', 'id')->onDelete()->cascade();
            $table->string('channel_name');
            $table->longtext('config')->nullable();
            $table->integer('sequence')->nullable();
            $table->boolean('status')->defaultValue(1);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('widget_channels');
    }
}
