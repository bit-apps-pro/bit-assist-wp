<?php

use BitApps\Assist\Core\Database\Blueprint;
use BitApps\Assist\Core\Database\Migration;
use BitApps\Assist\Core\Database\Schema;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTWidgetsTableMigration extends Migration
{
    public function up()
    {
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('styles')->nullable();
            $table->json('domains')->nullable();
            $table->json('business_hours')->nullable();
            $table->string('timezone')->nullable();
            $table->json('exclude_pages')->nullable();
            $table->integer('initial_delay')->defaultValue(0);
            $table->integer('page_scroll')->defaultValue(0);
            $table->tinyint('widget_behavior')->defaultValue(1);
            $table->string('custom_css')->nullable();
            $table->json('call_to_action')->nullable();
            $table->boolean('store_responses')->defaultValue(1);
            $table->json('delete_responses')->nullable();
            $table->json('integrations')->nullable();
            $table->boolean('status')->defaultValue(1);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('widgets');
    }
}
