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

        $widget->widget_channels = $widgetChannels;

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
        $pages = get_pages();
        $posts = get_posts();
        $allPageAndPosts = array_merge($pages, $posts);
        $allPageAndPosts = array_map(function ($item) {
            return [
                'id'    => $item->ID,
                'title' => $item->post_title,
                'url'   => get_permalink($item->ID),
            ];
        }, $allPageAndPosts);
        return $allPageAndPosts;
    }
}
