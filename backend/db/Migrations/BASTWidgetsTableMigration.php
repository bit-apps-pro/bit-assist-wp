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
            $table->longtext('styles')->nullable();
            $table->longtext('domains')->nullable();
            $table->longtext('business_hours')->nullable();
            $table->string('timezone')->nullable();
            $table->longtext('exclude_pages')->nullable();
            $table->integer('initial_delay')->defaultValue(0);
            $table->integer('page_scroll')->defaultValue(0);
            $table->tinyint('widget_behavior')->defaultValue(1);
            $table->string('custom_css')->nullable();
            $table->longtext('call_to_action')->nullable();
            $table->boolean('store_responses')->defaultValue(1);
            $table->longtext('delete_responses')->nullable();
            $table->longtext('integrations')->nullable();
            $table->boolean('status')->defaultValue(1);
            $table->boolean('active')->defaultValue(0);
            $table->boolean('hide_credit')->defaultValue(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::drop('widgets');
    }
}
