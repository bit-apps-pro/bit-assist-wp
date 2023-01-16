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

    public function __construct()
    {
        $this->isPro = class_exists(ProConfig::class) && ProConfig::isPro();
    }

    public function bitAssistWidget(Request $request)
    {
        $widget = $this->getWidget($request->domain);
        if (!isset($widget->id)) {
            return 'Widget not found';
        }

        $widgetChannels = $this->getChannelsByWidget($widget->id);
        if (is_null($widgetChannels)) {
            return 'Widget channels not found';
        }

        // $channels = $widget->widget_channels;
        // $widget->channelProto = $channels;

        $widget->widget_channels = $widgetChannels;
        $version = Config::VERSION;

        $channelFiles = [];

        foreach ($widget->widget_channels as $value) {
            if ($value->channel_name === 'FAQ' ||
                $value->channel_name === 'Knowledge-Base' ||
                $value->channel_name === 'Custom-Form' ||
                $value->channel_name === 'WP-Search') {
                if (in_array('./channels/render-' . strtolower($value->channel_name) . ".js?ver={$version}", $channelFiles)) {
                    continue;
                }
                array_push($channelFiles, './channels/render-' . strtolower($value->channel_name) . ".js?ver={$version}");
            }

            if ($value->channel_name === 'Google-Map' ||
                $value->channel_name === 'Youtube' ||
                $value->channel_name === 'Custom-Iframe'
            ) {
                if (in_array("./channels/render-custom-iframe.js?ver={$version}", $channelFiles)) {
                    continue;
                }

                array_push($channelFiles, "./channels/render-custom-iframe.js?ver={$version}");
            }
        };

        $widget->channelNames = $channelFiles;

        // error_log(print_r($widget->channelName), true);
        // $widget->channelName = $channelName;

        // $rootURL = Config::get('ROOT_URI');

        // $widget->file = file_get_contents($rootURL . '/client/packages/widget-iframe/channels/render-custom-form.js');

        return $widget;
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
