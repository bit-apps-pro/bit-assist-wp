<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\AssistPro\Config as ProConfig;
use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\WidgetStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetUpdateRequest;
use BitApps\Assist\Model\Widget;

final class WidgetController
{
    public function index()
    {
        return Widget::get(['id', 'name', 'status', 'active', 'created_at']);
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
        if (!(class_exists(ProConfig::class) && ProConfig::isPro()) && Widget::count() >= 1) {
            return Response::error('Limited 1 widgets in free version');
        }

        $newWidget = [
            'name'   => trim($request->name),
            'styles' => [
                'size'    => 60,
                'shape'   => 'semiRounded',
                'color'   => $request->color,
                'icon'    => 'widget-icon-1',
                'iconUrl' => Config::get('ROOT_URI') . '/img/widget/widgetIcon1.svg',
                'position'=> 'bottom-right',
            ]
        ];

        $activeWidget = Config::getOption('widget_active');
        if (empty($activeWidget)) {
            $newWidget['active'] = 1;
        }

        $widget = Widget::insert($newWidget);
        if (isset($widget->id) && empty($activeWidget)) {
            Config::updateOption('widget_active', $widget->id);
        }

        return Response::success('Widget created successfully');
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
}
