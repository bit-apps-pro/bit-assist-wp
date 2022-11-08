<?php

use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTResponsesTableMigration extends Migration
{
    public function up()
    {
        Schema::create('responses', function (Blueprint $table) {
            $table->id();
            $table->bigint('widget_channel_id', 20)->unsigned()->foreign('widget_channels', 'id')->onDelete()->cascade();
            $table->longtext('response');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('responses');
    }
}
