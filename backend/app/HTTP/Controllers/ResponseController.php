<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Client\HttpClient;
use BitApps\Assist\Core\Http\Response as Res;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Model\Response;
use BitApps\Assist\Model\WidgetChannel;

final class ResponseController
{
    public function index(Request $request, $widgetChannelId)
    {
        return Response::where('widget_channel_id', $widgetChannelId)
        ->skip(($request->page ?? 1) * $request->limit - $request->limit)
        ->take($request->limit)
        ->desc()
        ->get();
    }

    public function othersData($widgetChannelId)
    {
        if (is_null($widgetChannelId)) {
            return Res::error('WidgetChannel id is required');
        }

        $config = WidgetChannel::where('id', $widgetChannelId)->select(['config'])->first()->config;
        $totalResponses = Response::where('widget_channel_id', $widgetChannelId)->count();

        return [
            'channelName'    => $config->title ?? 'Untitled',
            'formFields'     => $config->card_config->form_fields ?? [],
            'totalResponses' => $totalResponses,
        ];
    }

    public function store(Request $request)
    {
        $formData = $request->formData;
        $widgetChannelId = $formData['widget_channel_id'] ?? null;
        if (is_null($widgetChannelId)) {
            return Res::error('WidgetChannel id is required');
        }
        unset($formData['widget_channel_id']);

        $config = WidgetChannel::where('id', $widgetChannelId)->select(['config'])->first()->config;

        if (isset($config->card_config->webhook_url) && !empty($config->card_config->webhook_url)) {
            $webhook = new HttpClient();
            $webhook->request($config->card_config->webhook_url, 'POST', json_encode($formData));
        }

        if (isset($config->store_responses) && !empty($config->store_responses)) {
            Response::insert([
                'widget_channel_id' => $widgetChannelId,
                'response'          => $formData
            ]);
        }

        return Res::success('Form Submitted');
    }

    public function destroy(Request $request)
    {
        Response::whereIn('id', $request->responseIds)->delete();

        return Res::success('Selected response deleted');
    }
}
