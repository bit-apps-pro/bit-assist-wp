<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\AssistPro\Config as ProConfig;
use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\WidgetChannelStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetChannelUpdateRequest;
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
        $validated = $request->all();
        $isPro = class_exists(ProConfig::class) && ProConfig::isPro();

        if (!$isPro && WidgetChannel::where('widget_id', $validated['widget_id'])->count() >= 2) {
            return Response::error('You can use 2 channel in free version.');
        }
        if (!$isPro && !empty($validated['config']['hide_after_office_hours'])) {
            unset($validated['config']['hide_after_office_hours']);
        }
        if (!$isPro && $validated['channel_name'] === 'Custom-Form' && !empty($validated['config']['card_config']['webhook_url'])) {
            unset($validated['config']['card_config']['webhook_url']);
        }

        $result = WidgetChannel::insert($validated);

        if ($result) {
            return Response::success('Channel created successfully');
        }
        return Response::error('Something went wrong');
    }

    public function update(WidgetChannelUpdateRequest $request, WidgetChannel $widgetChannel)
    {
        $validated = $request->all();
        $isPro = class_exists(ProConfig::class) && ProConfig::isPro();

        if (!$isPro && !empty($validated['config']['hide_after_office_hours'])) {
            unset($validated['config']['hide_after_office_hours']);
        }
        if (!$isPro && $validated['channel_name'] === 'Custom-Form' && !empty($validated['config']['card_config']['webhook_url'])) {
            unset($validated['config']['card_config']['webhook_url']);
        }

        $widgetChannel->update($validated);

        if ($widgetChannel->save()) {
            return Response::success('Channel updated successfully');
        }
        return Response::error('Something went wrong');
    }

    public function destroy(WidgetChannel $widgetChannel)
    {
        $widgetChannel->delete();

        return Response::success('Channel deleted');
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

    public function copy(WidgetChannel $widgetChannel)
    {
        $isPro = class_exists(ProConfig::class) && ProConfig::isPro();
        if (!$isPro && WidgetChannel::where('widget_id', $widgetChannel->widget_id)->count() >= 2) {
            return Response::error('You can use 2 channel in free version.');
        }

        if ($widgetChannel->exists()) {
            $newWidgetChannel = $this->replicate($widgetChannel);
            $result = WidgetChannel::insert((array)$newWidgetChannel);
            if ($result) {
                return Response::success('Channel copied successfully');
            }
        }
        return Response::error('Something went wrong');
    }

    private function replicate($widgetChannel)
    {
        $newWidgetChannel = (object)[];
        $newWidgetChannel->widget_id = $widgetChannel->widget_id;
        $newWidgetChannel->channel_name = $widgetChannel->channel_name;
        $newWidgetChannel->config = $widgetChannel->config;
        $newWidgetChannel->config->title = $widgetChannel->config->title . ' (Copy)';
        $newWidgetChannel->sequence = WidgetChannel::where('widget_id', $widgetChannel->widget_id)->max('sequence') + 1;
        $newWidgetChannel->status = $widgetChannel->status;
        return $newWidgetChannel;
    }
}
