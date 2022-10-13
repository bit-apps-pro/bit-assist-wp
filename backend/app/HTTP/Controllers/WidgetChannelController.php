<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\WidgetChannelStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetChannelUpdateRequest;
use BitApps\Assist\Model\Widget;
use BitApps\Assist\Model\WidgetChannel;

final class WidgetChannelController
{
    public function index(Request $request)
    {
        return WidgetChannel::where('widget_id', $request->widgetId)->orderBy('sequence')->get();
    }

    public function show(WidgetChannel $widgetChannel)
    {
        if ($widgetChannel->exists()) {
            return $widgetChannel;
        }
        return Response::error($widgetChannel);
    }

    public function store(WidgetChannelStoreRequest $request)
    {
        WidgetChannel::insert($request->all());

        return Response::success('WidgetChannel created successfully');
    }

    public function update(WidgetChannelUpdateRequest $request, WidgetChannel $widgetChannel)
    {
        $widgetChannel->update($request->all());

        return $widgetChannel->save();
    }

    public function destroy(WidgetChannel $widgetChannel)
    {
        $widgetChannel->delete();

        return Response::success('WidgetChannel deleted');
    }

    public function updateSequence(Request $request)
    {
        foreach ($request->widgetChannels as $widgetChannel) {
            WidgetChannel::take(1)->find($widgetChannel['id'])
            ->update(['sequence' => $widgetChannel['sequence']])
            ->save();
        }

        return Response::success('Sequence ordered');
    }
}
