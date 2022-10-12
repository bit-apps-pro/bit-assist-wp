<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\WidgetStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetUpdateRequest;
use BitApps\Assist\Model\Widget;
use WP_Error;

final class WidgetController
{
    public function index()
    {
        return Widget::get(['id', 'name', 'status']);
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
        // return $request->all() + ['styles' => [
        //     'size'    => 60,
        //     'shape'   => 'semiRounded',
        //     'color'   => '#00ffa3',
        //     'icon'    => 'widget-icon-1',
        //     'iconUrl' => 'https://ik.imagekit.io/shuvo/widget_icons/eye_j4gQF6dk-.png?ik-sdk-version=javascript-1.4.3&updatedAt=1656306394910',
        //     'position'=> 'bottom-right',
        // ]];
        Widget::insert($request->all());

        return Response::success('WidgetChannel created successfully');
    }

    public function update(WidgetUpdateRequest $request, Widget $widget)
    {
        $widget->update($request->all());

        return $widget->save();
    }

    public function destroy(Widget $widget)
    {
        $widget->delete();

        return Response::success('Widget deleted');
    }

    public function changeStatus(Request $request, Widget $widget)
    {
        $widget->update(['status' => $request->status]);

        if ($widget->save()) {
            return Response::success('Widget status changed');
        }
        return  Response::error('Widget status not changed');
    }
}
