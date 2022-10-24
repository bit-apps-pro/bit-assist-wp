<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\WidgetStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetUpdateRequest;
use BitApps\Assist\Model\Widget;
use BitApps\Assist\Model\WidgetChannel;
use WP_Error;

final class WidgetController
{
    public function index()
    {
        return Widget::get(['id', 'name', 'status', 'created_at']);
    }

    public function show(Widget $widget)
    {
        if ($widget->exists()) {
            return $widget;
        }
        return Response::error($widget);
    }

    public function store(WidgetStoreRequest $request)
    {
        $newWidget = [
            'name'   => trim($request->name),
            'styles' => [
                'size'    => 60,
                'shape'   => 'semiRounded',
                'color'   => $request->color,
                'icon'    => 'widget-icon-1',
                'iconUrl' => Config::get('ROOT_URI') . '/img/widget/widgetIcon1.webp',
                'position'=> 'bottom-right',
            ]
        ];
        Widget::insert($newWidget);

        return Response::success('WidgetChannel created successfully');
    }

    public function update(WidgetUpdateRequest $request, Widget $widget)
    {
        $widget->update($request->all());

        if ($widget->save()) {
            return Response::success('Widget updated');
        }
        return  Response::error('Widget update failed');
    }

    public function destroy(Widget $widget)
    {
        $widget->delete();

        if (Config::getOption('widget_active') == $widget->id) {
            Config::updateOption('widget_active', null);
        }

        return Response::success('Widget deleted');
    }

    public function changeStatus(Request $request, Widget $widget)
    {
        $widget->update(['status' => $request->status]);

        if ($widget->save()) {
            if ($widget->active) {
                Config::updateOption('widget_active', ($request->status ? $widget->id : null));
            }

            return Response::success('Widget status changed');
        }
        return  Response::error('Widget status not changed');
    }

    public function changeActive(Request $request, $widgetId)
    {
        $activeWidget = Widget::where('active', 1)->where('id', '!=', $widgetId)->first();
        if (isset($activeWidget->id)) {
            return Response::error('You have another active widget in your website');
        }

        $widget = Widget::where('id', $widgetId)->first();
        $widget->update(['active' => $request->active]);

        if ($widget->save()) {
            Config::updateOption('widget_active', (($request->active && $widget->status) ? $widget->id : null));
            if ($request->active) {
                return Response::success('Widget activated');
            }
            return Response::success('Widget deactivated');
        }
        return Response::error('Something went wrong');
    }

    public function bitAssistWidget(Request $request)
    {
        $widget = Widget::where('status', 1)->where('active', 1)->select(
            ['id', 'name', 'styles', 'business_hours', 'timezone', 'exclude_pages', 'initial_delay', 'page_scroll', 'widget_behavior', 'custom_css', 'call_to_action', 'store_responses', 'delete_responses', 'status']
        )->first();
        $widgetChannels = WidgetChannel::where('status', 1)->where('widget_id', $widget->id)->orderBy('sequence')->get(['id', 'channel_name', 'config']);

        if (count($widgetChannels) < 1) {
            return 'Widget channel not found';
        }

        $rootURL = Config::get('ROOT_URI');
        foreach ($widgetChannels as $key => $value) {
            $widgetChannels[$key]->channel_icon = $rootURL . '/img/channel/' . strtolower($value->channel_name) . '.png';
        }
        $widget->widget_channels = $widgetChannels;

        return $widget;
    }
}
