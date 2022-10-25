<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Client\HttpClient;
use BitApps\Assist\Core\Http\Response as Res;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Model\Response;
use BitApps\Assist\Model\WidgetChannel;

final class ResponseController
{
    public function index($widgetChannelId, $page, $limit)
    {
        return Response::where('widget_channel_id', $widgetChannelId)
        ->skip(($page * $limit) - $limit)
        ->take($limit)
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

        if (!empty($config->card_config->webhook_url)) {
            $webhook = new HttpClient();
            $webhook->request($config->card_config->webhook_url, 'POST', json_encode($formData));
        }

        if (!empty($config->store_responses)) {
            Response::insert([
                'widget_channel_id' => $widgetChannelId,
                'response'          => $formData
            ]);
        }

        if (!empty($config->card_config->send_mail_to)) {
            $this->sendMail($config->card_config->send_mail_to, $config->title, $formData);
        }

        return Res::success(!empty($config->card_config->success_message) ? $config->card_config->success_message : 'Submitted successfully');
    }

    public function sendMail($email, $formTitle, $data)
    {
        $subject = $formTitle . ' Submitted';
        add_filter('wp_mail_content_type', [$this, 'content_type']);
        $emailTemplate = '<h2>' . $subject . '</h2>';
        foreach ($data as $key => $value) {
            $emailTemplate .= '<p><strong>' . $key . '</strong>: ' . $value . '</p>';
        }
        wp_mail($email, $subject, $emailTemplate);
        remove_filter('wp_mail_content_type', [$this, 'content_type']);
    }

    public function content_type()
    {
        return 'text/html';
    }

    public function destroy(Request $request)
    {
        Response::whereIn('id', $request->responseIds)->delete();

        return Res::success('Selected response deleted');
    }
}
