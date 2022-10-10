<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

class Widget extends Model
{
    protected $casts = [
        'styles'           => 'object',
        'call_to_action'   => 'object',
        'delete_responses' => 'object',
        'domains'          => 'array',
        'business_hours'   => 'array',
        'exclude_pages'    => 'array',
        'integrations'     => 'array',
        'status'           => 'int',
    ];

    protected $fillable = [
        'name',
        'styles',
        'domains',
        'business_hours',
        'timezone',
        'exclude_pages',
        'initial_delay',
        'page_scroll',
        'widget_behavior',
        'custom_css',
        'call_to_action',
        'store_responses',
        'delete_responses',
        'integrations',
        'status',
    ];

    public function widgetChannels()
    {
        return $this->hasMany(WidgetChannel::class);
    }
}
