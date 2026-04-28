<?php

namespace BitApps\Assist\HTTP\Controllers;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Config;
use BitApps\Assist\Deps\BitApps\WPKit\Hooks\Hooks;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Response as Res;
use BitApps\Assist\Helpers\FileHandler;
use BitApps\Assist\Model\Response;
use BitApps\Assist\Model\WidgetChannel;
use BitApps\Assist\Services\FormMailer;

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
        if (\is_null($widgetChannelId)) {
            return Res::error(__('WidgetChannel id is required', 'bit-assist'));
        }

        $config = WidgetChannel::where('id', $widgetChannelId)->select(['config'])->first()->config;

        return [
            'channelName'    => $config->title ?? __('Untitled', 'bit-assist'),
            'formFields'     => $config->card_config->form_fields ?? [],
            'totalResponses' => Response::where('widget_channel_id', $widgetChannelId)->count(),
        ];
    }

    public function store(Request $request)
    {
        $formData = $request->validate([
            'widget_channel_id' => ['required', 'integer'],
            '*'                 => ['nullable', 'sanitize:text'],
        ]);

        $widgetChannelId = $formData['widget_channel_id'];
        unset($formData['widget_channel_id']);

        $config = WidgetChannel::where('id', $widgetChannelId)->select(['config'])->first()->config;

        Hooks::doAction(Config::withPrefix('after_form_response'), $formData, $config);

        $needsFiles  = !empty($config->store_responses) || !empty($config->card_config->send_mail_to);
        $storedFiles = $needsFiles ? $this->storeFiles($request->files() ?: [], $widgetChannelId) : [];

        if (!empty($config->store_responses)) {
            Response::insert([
                'widget_channel_id' => $widgetChannelId,
                'response'          => array_merge($formData, $storedFiles),
            ]);
        }

        if (!empty($config->card_config->send_mail_to)) {
            (new FormMailer())->send(
                $config->card_config->send_mail_to,
                $config->title,
                $formData,
                $storedFiles,
                $widgetChannelId
            );
        }

        return Res::success(
            $config->card_config->success_message ?? __('Submitted successfully', 'bit-assist')
        );
    }

    public function destroy(Request $request)
    {
        Response::whereIn('id', $request->responseIds)->delete();

        return Res::success(__('Selected response deleted', 'bit-assist'));
    }

    private function storeFiles(array $files, int $widgetChannelId): array
    {
        $fileHandler = new FileHandler();
        $stored = [];

        foreach ($files as $name => $details) {
            $path = $fileHandler->moveUploadedFiles($details, $widgetChannelId);
            if ($path) {
                $stored[$name] = $path;
            }
        }

        return $stored;
    }
}
