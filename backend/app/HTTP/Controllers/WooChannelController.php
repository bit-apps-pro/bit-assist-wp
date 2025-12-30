<?php

namespace BitApps\Assist\HTTP\Controllers;

use AllowDynamicProperties;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Assist\Model\WidgetChannel;

#[AllowDynamicProperties]
final class WooChannelController
{
    public function orderDetails(Request $request)
    {
        if (!is_user_logged_in()) {
            return ['message' => 'You must be logged in to view order details', 'status_code' => 401];
        }

        if (!class_exists('WooCommerce')) {
            return ['message' => 'WooCommerce not installed or active.', 'status_code' => 404];
        }

        $order_id = sanitize_text_field($request->get('number'));
        $billing_email = sanitize_email($request->get('email'));
        $widget_channel_id = intval($request->get('widget_channel_id'));

        if (!$order_id) {
            return ['message' => 'Order ID is required', 'status_code' => 422];
        }

        if (!$billing_email) {
            return ['message' => 'Billing email is required', 'status_code' => 422];
        }

        $widget_channel = WidgetChannel::where('id', $widget_channel_id)->first();
        if (!$widget_channel->exists()) {
            return ['message' => 'Widget channel not found', 'status_code' => 404];
        }

        $order = wc_get_order($order_id);

        if (empty($order)) {
            return ['message' => 'Order not found', 'status_code' => 404];
        }

        $current_user_id = get_current_user_id();
        $order_user_id = $order->get_user_id();

        if ($current_user_id !== $order_user_id) {
            return ['message' => 'You are not authorized to view this order', 'status_code' => 403];
        }

        if ($billing_email !== $order->get_billing_email()) {
            return ['message' => 'Billing email does not match', 'status_code' => 422];
        }

        return [
            'items' => [
                [
                    'order_id'        => $order->get_id(),
                    'shipping_status' => $order->get_status(),
                    'total_items'     => $order->get_item_count(),
                    'total_amount'    => $order->get_total(),
                    'billing_name'    => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                    'shipping_name'   => $order->get_shipping_first_name() . ' ' . $order->get_shipping_last_name(),
                ]
            ],
            'status_code' => 200
        ];
    }
}
