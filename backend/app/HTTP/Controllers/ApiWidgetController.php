<?php

namespace BitApps\Assist\HTTP\Controllers;

use AllowDynamicProperties;
use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Model\Widget;
use BitApps\Assist\Model\WidgetChannel;
use BitApps\AssistPro\Config as ProConfig;
use stdClass;
use WP_Query;

#[AllowDynamicProperties]
final class ApiWidgetController
{
    private $isPro = false;

    private $allDifferentChannels = ['FAQ', 'Knowledge-Base', 'Custom-Form', 'WP-Search', 'WooCommerce'];

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
            $this->makeFilesAndDbOptionEmpty($baseURL);

            return 'Widget not found';
        }

        $widgetChannels = $this->getChannelsByWidget($widget->id);

        if (\is_null($widgetChannels)) {
            $this->makeFilesAndDbOptionEmpty($baseURL);

            return 'Widget channels not found';
        }

        return $this->getActiveChannels($widget, $baseURL, $version, $widgetChannels);
    }

    public function wpSearch(Request $request)
    {
        $validate = $request->validate([
            'search' => ['string']
        ]);
        if (!empty($validate)) {
            return ['message' => 'Search query is not a valid string!', 'status_code' => 404];
        }

        return $this->getPageAndPosts($request->search, $request->page);
    }

    private function getPageAndPosts($search, $page)
    {
        $paged = !empty($page) ? $page : 1;
        $args  = [
            'post_type'      => ['page', 'post'],
            'post_status'    => 'publish',
            'posts_per_page' => 10,
            's'              => $search,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'paged'          => $paged,
            'fields'         => 'ids'
        ];

        $query = new WP_Query($args);

        $results = [];
        foreach ($query->posts as $post_id) {
            $post = get_post($post_id);

            $result = [
                'guid'       => get_permalink($post_id),
                'post_title' => $post->post_title,
                'post_type'  => $post->post_type,
            ];

            $results[] = $result;
        }

        $query->pagination = [
            'total'        => $query->max_num_pages,
            'current'      => $paged,
            'next'         => $paged + 1,
            'previous'     => $paged - 1,
            'has_next'     => $paged < $query->max_num_pages,
            'has_previous' => $paged > 1,
        ];
        
        return ['data' => $results, 'pagination' => $query->pagination];
    }

    public function orderDetails(Request $request)
    {
        if (!class_exists('WooCommerce')) {
            return ['message' => 'WooCommerce not installed or active.', 'status_code' => 404];
        }

        $order_id      = $request['number'];
        $billing_email = $request['email'];
        $allOrders     = [];

        global $wpdb;

        if ($order_id && $billing_email) {
            if (!empty(wc_get_order($order_id)) && $billing_email === wc_get_order($order_id)->get_billing_email()) {
                $item = $this->getOrderWithIdAndMail($order_id);

                return ['items' => $item, 'status_code' => 200];
            }

            return ['message' => 'No order found', 'status_code' => 404];
        } elseif ($order_id && !empty(wc_get_order($order_id))) {
            $item = $this->getOrderWithIdAndMail($order_id);

            return ['items' => $item, 'status_code' => 200];
        } elseif ($billing_email) {
            $query = $wpdb->prepare(
                "SELECT * FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s",
                '_billing_email', $billing_email
            );

            $orders = $wpdb->get_results($query);

            if ($orders) {
                foreach ($orders as $order) {
                    $order_details = wc_get_order($order->post_id);
                    $allOrders[]   = $order_details;
                }
                $data = $this->allOrderWithPagination($request, $allOrders);

                return $data;
            }

            return ['message' => 'No order found', 'status_code' => 404];
        }

        return ['message' => 'No order found', 'status_code' => 404];
    }

    private function makeFilesAndDbOptionEmpty($baseURL)
    {
        $activeChannelWPOptions = Config::getOption('active_channels');

        $activeChannelWPOptions['channel_names']  = '';
        $activeChannelWPOptions['channel_status'] = 0;
        Config::updateOption('active_channels', $activeChannelWPOptions);

        file_put_contents($baseURL . 'iframe/assets/channels/features.js', '');

        if (Config::isDev()) {
            file_put_contents($baseURL . 'client/packages/widget-iframe/channels/features.js', '');
        }
    }

    private function getActiveChannels($widget, $baseURL, $version, $widgetChannels)
    {
        $widget->widget_channels = $widgetChannels;

        $activeChannelWPOptions = Config::getOption('active_channels');

        $this->getChannels($baseURL, $widget, $activeChannelWPOptions, $version);

        $get_options_version = Config::getOption('active_channels');
        $new_version         = $get_options_version['version'];

        $widget->featuresJsPath = Config::isDev() ? "./channels/features.js?ver={$new_version}" : plugins_url() . '/' . Config::SLUG . "/iframe/assets/channels/features.js?ver={$new_version}";

        $widget->isAnalyticsActivate = (int)Config::getOption('analytics_activate');

        return $widget;
    }

    private function getChannels($baseURL, $widget, $activeChannelWPOptions, $version)
    {
        $activeChannels = [];
        $outputFilePath = '';

        if (Config::isDev()) {
            $importJsArray[] = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/common.js');
            $outputFilePath  = $baseURL . 'client/packages/widget-iframe/channels/features.js';
        }

        $importJsIframe[]     = file_get_contents($baseURL . 'iframe/assets/channels/common.js');
        $outputFilePathIframe = $baseURL . 'iframe/assets/channels/features.js';

        $channel_names          = $this->getActiveChannelsNameString($widget, $activeChannelWPOptions, $version);
        $activeChannelWPOptions = $this->updateOptionOnChannelChange($activeChannelWPOptions, $channel_names, $version);

        if ($activeChannelWPOptions['channel_status'] == 0 || !file_exists($outputFilePathIframe)) {
            $importJsArray  = [];
            $importJsIframe = [];

            if (Config::isDev()) {
                $importJsArray[]  = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/common.js');
            }
            $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/common.js');

            foreach ($widget->widget_channels as $channel) {
                if (\in_array($channel->channel_name, $this->allDifferentChannels)) {
                    if (\in_array($channel->channel_name, $activeChannels)) {
                        continue;
                    }

                    $activeChannels[] = $channel->channel_name;

                    if (Config::isDev()) {
                        $importJsArray[] = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js');

                        $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js');
                    } else {
                        $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/' . strtolower(str_replace('-', '_', $channel->channel_name)) . '.js');
                    }
                }

                if (\in_array($channel->channel_name, $this->allSimilarChannels)) {
                    if (\in_array('Google-Map', $activeChannels) || \in_array('Youtube', $activeChannels) || \in_array('Custom-Iframe', $activeChannels)) {
                        continue;
                    }

                    $activeChannels[] = $channel->channel_name;

                    if (Config::isDev()) {
                        $importJsArray[] = file_get_contents($baseURL . 'client/packages/widget-iframe/channels/custom_iframe.js');

                        $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/custom_iframe.js');
                    } else {
                        $importJsIframe[] = file_get_contents($baseURL . 'iframe/assets/channels/custom_iframe.js');
                    }
                }
            }

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
            $activeChannelWPOptions['version']        = $version . '.' . wp_rand(10000, 9999999) . strtotime('now');

            Config::updateOption('active_channels', $activeChannelWPOptions);
        }

        return $activeChannelWPOptions;
    }

    private function writeActiveChannelsJS($activeChannelWPOptions, $channel_names, $outputFilePathIframe, $importJsIframe, $outputFilePath, $importJsArray)
    {
        if ($activeChannelWPOptions['channel_names'] != $channel_names || !file_exists($outputFilePathIframe)) {
            $activeChannelWPOptions['channel_status'] = 1;
            $activeChannelWPOptions['channel_names']  = $channel_names;
            Config::updateOption('active_channels', $activeChannelWPOptions);

            if (Config::isDev()) {
                file_put_contents($outputFilePathIframe, implode(PHP_EOL, $importJsIframe));
                file_put_contents($outputFilePath, implode(PHP_EOL, $importJsArray));
            } else {
                file_put_contents($outputFilePathIframe, implode(PHP_EOL, $importJsIframe));
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
            $domainExceptWWW = $domain;
            if (stristr($domainExceptWWW, 'www.')) {
                $domainExceptWWW = str_replace('www.', '', $domainExceptWWW);
            } else {
                $domainExceptWWW = $domain;
            }
            $widget->where('domains', 'LIKE', '%' . parse_url($domainExceptWWW)['host'] . '%');
        } else {
            return;
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
        if (\count($widgetChannels) < 1) {
            return;
        }

        $rootURL = Config::get('ROOT_URI');
        foreach ($widgetChannels as $key => $value) {
            if (!empty($widgetChannels[$key]->config->channel_icon)) {
                $widgetChannels[$key]->channel_icon = $widgetChannels[$key]->config->channel_icon;

                continue;
            }
            $widgetChannels[$key]->channel_icon = $rootURL . '/img/channel/' . strtolower($value->channel_name) . '.svg';
        }

        foreach ($widgetChannels as $channel) {
            $channel->config->title = esc_html($channel->config->title);
            $channel = $this->escapeAll($channel);
        }

        return $widgetChannels;
    }

    private function escapeAll($channel)
    {
        if ($channel->channel_name === 'Custom-Channel') {
            $channel->config->unique_id = esc_url_raw($channel->config->unique_id);
            $channel->config->url       = esc_url_raw($channel->config->url);
        }

        if ($channel->channel_name === 'Google-Map') {
            $channel = $this->sanitizeIframe($channel);
        }

        if ($channel->channel_name === 'Custom-Iframe') {
            $channel->config->unique_id = esc_url_raw($channel->config->unique_id);
            $channel->config->url       = esc_url_raw($channel->config->url);
        }

        if ($channel->channel_name === 'FAQ' || $channel->channel_name === 'Knowledge-Base') {
            $channel = $this->escapeTitle($channel);
        }

        return $channel;
    }

    private function sanitizeIframe($channel)
    {
        $allowedAttributes = [
            'iframe' => [
                'src'             => [],
                'width'           => [],
                'height'          => [],
                'style'           => [],
                'allowfullscreen' => [],
                'loading'         => [],
                'referrerpolicy'  => [],
            ],
        ];

        if (\is_object($channel)) {
            $channel->config->unique_id = wp_kses($channel->config->unique_id, $allowedAttributes);
        } else {
            $channel['config']['unique_id'] = wp_kses($channel['config']['unique_id'], $allowedAttributes);
        }

        return $channel;
    }

    private function escapeTitle($channel)
    {

        $faqs  = new stdClass();
        $kbs   = new stdClass();

        if ($channel->channel_name === 'FAQ') {
            $faqs = &$channel->config->card_config->faqs;

            foreach ($faqs as &$faq) {
                if (isset($faq->title)) {
                    $faq->title = esc_html($faq->title);
                }
            }
        } else {
            $kbs = &$channel->config->card_config->knowledge_bases;

            foreach ($kbs as &$kb) {
                if (isset($kb->title)) {
                    $kb->title = esc_html($kb->title);
                }
            }
        }

        return $channel;
    }

    private function getOrderWithIdAndMail($order_id)
    {
        $order_details   = wc_get_order($order_id);
        $shipping_status = $order_details->get_status();
        $total_items     = $order_details->get_item_count();
        $total_amount    = $order_details->get_total();
        $billing_name    = $order_details->get_billing_first_name() . ' ' . $order_details->get_billing_last_name();
        $shipping_name   = $order_details->get_shipping_first_name() . ' ' . $order_details->get_shipping_last_name();

        $item[] = ['order_id' => $order_id, 'shipping_status' => $shipping_status, 'total_items' => $total_items, 'total_amount' => $total_amount, 'billing_name' => $billing_name, 'shipping_name' => $shipping_name];

        return $item;
    }

    private function allOrderWithPagination($request, $allOrders)
    {
        $paged    = !empty($request['page']) ? $request['page'] : 1;
        $per_page = 10;

        $args = [
            'post_type'      => 'shop_order',
            'post_status'    => 'any',
            'orderby'        => 'ID',
            'order'          => 'ASC',
            'paged'          => $paged,
            'posts_per_page' => $per_page,
            'post__in'       => wp_list_pluck($allOrders, 'ID')

        ];

        $orders_query = new WP_Query($args);

        $allItems = $this->allItemsForEmail($orders_query);

        $orders_query->pagination = [
            'total'        => $orders_query->max_num_pages,
            'current'      => $paged,
            'next'         => $paged + 1,
            'previous'     => $paged - 1,
            'has_next'     => $paged < $orders_query->max_num_pages,
            'has_previous' => $paged > 1,
        ];

        return ['items' => $allItems, 'pagination' => $orders_query->pagination, 'status_code' => 200];
    }

    private function allItemsForEmail($orders_query)
    {
        $items = [];

        foreach ($orders_query->posts as $order) {
            $order_id      = $order->ID;
            $order_details = wc_get_order($order_id);

            $item_count      = $order_details->get_item_count();
            $total           = $order_details->get_total();
            $shipping_status = $order_details->get_status('shipping');
            $shipping_name   = $order_details->get_shipping_first_name() . ' ' . $order_details->get_shipping_last_name();
            $billing_name    = $order_details->get_billing_first_name() . ' ' . $order_details->get_billing_last_name();

            $items[] = ['order_id' => $order_id, 'shipping_status' => $shipping_status, 'total_items' => $item_count, 'total_amount' => $total, 'billing_name' => $billing_name, 'shipping_name' => $shipping_name];
        }

        return $items;
    }
}
