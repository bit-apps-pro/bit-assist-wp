<?php

use BitApps\Assist\Config;
use BitApps\Assist\Core\Database\Connection as DB;
use BitApps\Assist\Core\Database\Migration;

if (!\defined('ABSPATH')) {
    exit;
}

final class BASTPluginOptions extends Migration
{
    public function up()
    {
        if (!Config::getOption('installed', null)) {
            Config::addOption('widget_active', null, true);
            Config::addOption('db_version', Config::DB_VERSION, true);
            Config::addOption('installed', time(), true);
            Config::addOption('version', Config::VERSION, true);
        }

        if (Config::getOption('active_channels') === false) {
            $options = [
                'channel_names'  => '',
                'channel_status' => 0
            ];

            Config::addOption('active_channels', $options, true);
        }
    }

    public function down()
    {
        $pluginOptions = [
            Config::withPrefix('widget_active'),
            Config::withPrefix('db_version'),
            Config::withPrefix('installed'),
            Config::withPrefix('version'),
            Config::withPrefix('active_channels'),
        ];

        DB::query(
            DB::prepare(
                'DELETE FROM `' . DB::wpPrefix() . 'options` WHERE option_name in ('
                    . implode(
                        ',',
                        array_map(
                            function () {
                                return '%s';
                            },
                            $pluginOptions
                        )
                    ) . ')',
                $pluginOptions
            )
        );
    }
}
