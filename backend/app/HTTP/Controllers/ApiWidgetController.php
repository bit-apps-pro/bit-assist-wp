<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\AssistPro\Config as ProConfig;
use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Model\Widget;
use BitApps\Assist\Model\WidgetChannel;

final class ApiWidgetController
{
    private $isPro = false;
    private $allDifferentChannels = ['FAQ', 'Knowledge-Base', 'Custom-Form', 'WP-Search'];
    private $allSimilarChannels = ['Google-Map', 'Youtube', 'Custom-Iframe'];

    public function __construct()
    {
        $this->isPro = class_exists(ProConfig::class) && ProConfig::isPro();
    }

    public function bitAssistWidget(Request $request)
    {
        $version = Config::VERSION;
        $baseURL = Config::get('BASEDIR_ROOT');

        $widget = $this->getWidget($request->domain);

        if (!isset($widget->id)) {
            $this->makeFilesAndDbOptionEmpty($widget, $baseURL);
            return 'Widget not found';
        }

        $widgetChannels = $this->getChannelsByWidget($widget->id);

        if (is_null($widgetChannels)) {
            $this->makeFilesAndDbOptionEmpty($widget, $baseURL);
            return 'Widget channels not found';
        }

        return $this->getActiveChannels($widget, $baseURL, $version, $widgetChannels);
    }

    private function makeFilesAndDbOptionEmpty($baseURL)
    {
        $activeChannelWPOptions = Config::getOption('active_channels');

        $activeChannelWPOptions['channel_names'] = '';
        $activeChannelWPOptions['channel_status'] = 0;
        Config::updateOption('active_channels', $activeChannelWPOptions);

        file_put_contents($baseURL . 'iframe/assets/channels/features.js', '');
        file_put_contents($baseURL . 'client/packages/widget-iframe/channels/features.js', '');
    }

    private function getActiveChannels($widget, $baseURL, $version, $widgetChannels)
    {
        $widget->widget_channels = $widgetChannels;

        $activeChannelWPOptions = Config::getOption('active_channels');

        $this->getChannels($baseURL, $widget, $activeChannelWPOptions, $version);

        $get_options_version = Config::getOption('active_channels');
        $new_version = $get_options_version['version'];

        $widget->featuresJsPath = "./channels/features.js?ver={$new_version}";

        return $widget;
    }

    private function getChannels($baseURL, $widget, $activeChannelWPOptions, $version)
    {
        $activeChannels = [];

        $importJsArray[] = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/common.js');
        $outputFilePath = $baseURL . 'client/packages/widget-iframe/channels/features.js';

        $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/common.js');
        $outputFilePathIframe = $baseURL . 'iframe/assets/channels/features.js';

        $channel_names = $this->getActiveChannelsNameString($widget, $activeChannelWPOptions, $version);
        $activeChannelWPOptions = $this->updateOptionOnChannelChange($activeChannelWPOptions, $channel_names, $version);

        if ($activeChannelWPOptions['channel_status'] == 0) {
            $importJsArray = [];
            $importJsIframe = [];

            $importJsArray[] = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/common.js');
            $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/common.js');

            foreach ($widget->widget_channels as $channel) {
                if (in_array($channel->channel_name, $this->allDifferentChannels)) {
                    if (in_array($channel->channel_name, $activeChannels)) {
                        continue;
                    }

                    array_push($activeChannels, $channel->channel_name);

                    if (Config::isDev()) {
                        array_push($importJsArray, file_get_contents($baseURL . 'client/packages/widget-iframe/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js'));

                        array_push($importJsIframe, file_get_contents($baseURL . 'iframe/assets/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js'));
                    } else {
                        array_push($importJsIframe, file_get_contents($baseURL . 'iframe/assets/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js'));
                    }
                }

                if (in_array($channel->channel_name, $this->allSimilarChannels)) {
                    if (in_array('Google-Map', $activeChannels) || in_array('Youtube', $activeChannels) || in_array('Custom-Iframe', $activeChannels)) {
                        continue;
                    }

                    array_push($activeChannels, $channel->channel_name);

                    if (Config::isDev()) {
                        array_push($importJsArray, file_get_contents($baseURL . 'client/packages/widget-iframe/channels/custom_iframe.js'));

                        array_push($importJsIframe, file_get_contents($baseURL . 'iframe/assets/channels/custom_iframe.js'));
                    } else {
                        array_push($importJsIframe, file_get_contents($baseURL . 'iframe/assets/channels/custom_iframe.js'));
                    }
                }
            };

            $this->writeActiveChannelsJS($activeChannelWPOptions, $channel_names, $outputFilePathIframe, $importJsIframe, $outputFilePath, $importJsArray);
        }
    }

    private function getActiveChannelsNameString($widget)
    {
        $channel_names = '';

        foreach ($widget->widget_channels as $channel) {
            $channel_names .= $channel->channel_name;
        }

        return $channel_names;
    }

    private function updateOptionOnChannelChange($activeChannelWPOptions, $channel_names, $version)
    {
        if ($activeChannelWPOptions['channel_names'] != $channel_names) {
            $activeChannelWPOptions['channel_status'] = 0;
            $activeChannelWPOptions['version'] = $version . '.' . mt_rand() . strtotime('now');

            Config::updateOption('active_channels', $activeChannelWPOptions);
        }

        return $activeChannelWPOptions;
    }

    private function writeActiveChannelsJS($activeChannelWPOptions, $channel_names, $outputFilePathIframe, $importJsIframe, $outputFilePath, $importJsArray)
    {
        if ($activeChannelWPOptions['channel_names'] != $channel_names) {
            $activeChannelWPOptions['channel_status'] = 1;
            $activeChannelWPOptions['channel_names'] = $channel_names;
            Config::updateOption('active_channels', $activeChannelWPOptions);

            if (Config::isDev()) {
                file_put_contents($outputFilePathIframe, implode('', $importJsIframe));
                file_put_contents($outputFilePath, implode('', $importJsArray));
            } else {
                file_put_contents($outputFilePathIframe, implode('', $importJsIframe));
            }
        }
    }

    private function getWidget($domain)
    {
        $widget = new Widget();
        $widget->where('status', 1);

        if (Config::get('SITE_URL') === $domain) {
            $widget->where('active', 1);
        } elseif ($this->isPro) {
            $widget->where('domains', 'LIKE', '%' . parse_url($domain)['host'] . '%');
        } else {
            return null;
        }

        $columns = ['id', 'name', 'styles', 'initial_delay', 'page_scroll', 'widget_behavior', 'call_to_action', 'store_responses', 'status', 'hide_credit'];

        if ($this->isPro) {
            $columns = array_merge($columns, ['custom_css', 'timezone', 'business_hours', 'exclude_pages']);
        }

        $widget->take(1)->get($columns);

        return $widget;
    }

    private function getChannelsByWidget($widgetId)
    {
        $widgetChannels = WidgetChannel::where('status', 1)->where('widget_id', $widgetId)->orderBy('sequence')->get(['id', 'channel_name', 'config']);
        if (count($widgetChannels) < 1) {
            return null;
        }

        $rootURL = Config::get('ROOT_URI');
        foreach ($widgetChannels as $key => $value) {
            if (!empty($widgetChannels[$key]->config->channel_icon)) {
                $widgetChannels[$key]->channel_icon = $widgetChannels[$key]->config->channel_icon;
                continue;
            }
            $widgetChannels[$key]->channel_icon = $rootURL . '/img/channel/' . strtolower($value->channel_name) . '.svg';
        }

        return $widgetChannels;
    }

    public function wpSearch(Request $request)
    {
        return $this->getPageAndPosts($request->search, $request->page);
    }

    private function getPageAndPosts($search, $page)
    {
        $paged = !empty($page) ? $page : 1;
        $args = [
            'post_type'      => ['page', 'post'],
            'post_status'    => 'publish',
            'posts_per_page' => 10,
            's'              => $search,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'paged'          => $paged,
        ];

        $query = new \WP_Query($args);
        $query->pagination = [
            'total'        => $query->max_num_pages,
            'current'      => $paged,
            'next'         => $paged + 1,
            'previous'     => $paged - 1,
            'has_next'     => $paged < $query->max_num_pages,
            'has_previous' => $paged > 1,
        ];

        return ['data' => $query->posts, 'pagination' => $query->pagination];
    }
}
