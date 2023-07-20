<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\HTTP\Requests\WidgetChannelStoreRequest;
use BitApps\Assist\HTTP\Requests\WidgetChannelUpdateRequest;
use BitApps\Assist\Model\WidgetChannel;
use BitApps\AssistPro\Config as ProConfig;

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
        $validated = $this->sanitizeRequest($request->all());

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
        $validated = $this->sanitizeRequest($request->all());

        $isPro     = class_exists(ProConfig::class) && ProConfig::isPro();

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
            $result           = WidgetChannel::insert((array) $newWidgetChannel);
            if ($result) {
                return Response::success('Channel copied successfully');
            }
        }

        return Response::error('Something went wrong');
    }

    private function replicate($widgetChannel)
    {
        $newWidgetChannel                = (object) [];
        $newWidgetChannel->widget_id     = $widgetChannel->widget_id;
        $newWidgetChannel->channel_name  = $widgetChannel->channel_name;
        $newWidgetChannel->config        = $widgetChannel->config;
        $newWidgetChannel->config->title = $widgetChannel->config->title . ' (Copy)';
        $newWidgetChannel->sequence      = WidgetChannel::where('widget_id', $widgetChannel->widget_id)->max('sequence') + 1;
        $newWidgetChannel->status        = $widgetChannel->status;

        return $newWidgetChannel;
    }

    private function sanitizeRequest($validated)
    {
        if ($validated['channel_name'] === 'Google-Map') {
            return $this->sanitizeIframe($validated);
        } elseif ($validated['channel_name'] === 'Custom-Channel') {
            return $this->sanitizeUrl($validated);
        } elseif ($validated['channel_name'] === 'Custom-Iframe') {
            return $this->sanitizeUrl($validated);
        } elseif ($validated['channel_name'] === 'FAQ' || $validated['channel_name'] === 'Knowledge-Base') {
            return $this->sanitizeTitle($validated, $validated['channel_name']);
        }

        return $validated;
    }

    private function sanitizeIframe($validated)
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

        $validated['config']['unique_id'] = wp_kses($validated['config']['unique_id'], $allowedAttributes);

        return $validated;
    }

    private function sanitizeUrl($validated)
    {
        $validated['config']['unique_id'] = sanitize_url($validated['config']['unique_id']);
        $validated['config']['url']       = sanitize_url($validated['config']['url']);

        return $validated;
    }

    private function sanitizeTitle($validated, $channelName)
    {
        $validated['config']['title'] = sanitize_text_field($validated['config']['title']);

        $faqs  = [];
        $kbs   = [];

        if ($channelName === 'FAQ') {
            $faqs = &$validated['config']['card_config']['faqs'];

            foreach ($faqs as &$faq) {
                if (isset($faq['title'])) {
                    $faq['title'] = sanitize_text_field($faq['title']);
                }
            }
        } else {
            $kbs = &$validated['config']['card_config']['knowledge_bases'];

            foreach ($kbs as &$kb) {
                if (isset($kb['title'])) {
                    $kb['title'] = sanitize_text_field($kb['title']);
                }
            }
        }

        return $validated;
    }
}
