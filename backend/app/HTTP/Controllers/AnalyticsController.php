<?php

namespace BitApps\Assist\HTTP\Controllers;

use AllowDynamicProperties;
use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Model\Analytic;
use BitApps\Assist\Model\Analytics;
use BitApps\AssistPro\Config as ProConfig;
use stdClass;

#[AllowDynamicProperties]
final class AnalyticsController
{
    private function analytics(Request $request){
        $validated = [
            'widget_id' => $request->widget_id,
            'is_clicked' => $request->is_clicked,
        ];

        if($request->channel_id){
            $validated['channel_id'] = $request->channel_id;
        }

        Analytics::insert((array)$request->all());

        return 'success';
    }

    private function isAnalyticsActive()
    {
        $analyticsOption = Config::getOption('analytics_activate');

        return ['widget_analytics' => (int)$analyticsOption, 'channel_analytics' => 0];
    }

    private function toggleAnalyticsOption(Request $request)
    {

        Config::updateOption('analytics_activate', $request->widget_analytics);

        $analyticsOption = Config::getOption('analytics_activate');

        return ['widget_analytics' => (int)$analyticsOption, 'channel_analytics' => 0];

    }
}