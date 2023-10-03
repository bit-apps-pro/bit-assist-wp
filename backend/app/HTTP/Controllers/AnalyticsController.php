<?php

namespace BitApps\Assist\HTTP\Controllers;

use AllowDynamicProperties;
use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Model\Analytics;

#[AllowDynamicProperties]
final class AnalyticsController
{
    private function getAnalyticsData()
    {
        $analyticsOption = Config::getOption('analytics_activate');

        if((int)$analyticsOption === 1){
            $widgetAnalyticsData = $this->getWidgetAnalytics();

            return ['widget_analytics' => (int)$analyticsOption, 'data' => $widgetAnalyticsData];
        }

        return ['widget_analytics' => (int)$analyticsOption];
    }

    private function store(Request $request){
        error_log(json_encode($request, JSON_PRETTY_PRINT));
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

    private function toggleAnalytics(Request $request)
    {

        Config::updateOption('analytics_activate', $request->widget_analytics);

        $analyticsOption = Config::getOption('analytics_activate');

        return ['widget_analytics' => (int)$analyticsOption];

    }

    private function getWidgetAnalytics()
    {
        global $wpdb;

        $sql = $wpdb->prepare(
                "SELECT
                    analytics.widget_id, widgets.name,
                    SUM(CASE WHEN analytics.is_clicked = %d THEN %d ELSE %d END) AS visitor_count,
                    SUM(CASE WHEN analytics.is_clicked = %d THEN %d ELSE %d END) AS click_count
                    FROM 
                        {$wpdb->prefix}bit_assist_analytics analytics
                    INNER JOIN 
                        {$wpdb->prefix}bit_assist_widgets widgets ON analytics.widget_id = widgets.id
                    WHERE 
                        analytics.channel_id IS NULL AND (analytics.is_clicked = %d OR analytics.is_clicked = %d)
                    GROUP BY 
                        analytics.widget_id, widgets.name", [0, 1, 0, 1, 1, 0, 0, 1]);

        $results = $wpdb->get_results($sql);

        return $results;
    }

    public function getChannelAnalytics($widget_id)
    {
        global $wpdb;

        $widgetChannel = $wpdb->prefix . 'bit_assist_widget_channels';
        $analytics = $wpdb->prefix . 'bit_assist_analytics';

        $sql = $wpdb->prepare(
            "SELECT
                c.id AS channel_id,
                JSON_UNQUOTE(JSON_EXTRACT(c.config, '$.title')) AS title,
                SUM(CASE WHEN a.channel_id IS NULL AND a.created_at >= c.created_at THEN %d ELSE %d END) AS visitor_count,
                SUM(CASE WHEN a.channel_id = c.id THEN %d ELSE %d END) AS click_count
                FROM
                    {$wpdb->prefix}bit_assist_widget_channels AS c
                LEFT JOIN
                    {$wpdb->prefix}bit_assist_analytics AS a
                ON
                    c.widget_id = a.widget_id
                WHERE
                    c.widget_id = %d
                AND
                    a.is_clicked = %d
                GROUP BY
                    c.id"
            , [1, 0, 1, 0, $widget_id, 1]);

        $results = $wpdb->get_results($sql);

        return ['data' => $results];
    }

    public function destroy()
    {
        $deleteResponse = Analytics::delete();
        error_log(json_encode('=========================', JSON_PRETTY_PRINT));
        error_log(json_encode($deleteResponse, JSON_PRETTY_PRINT));
        return Response::success('Analytics removed!');
    }

}