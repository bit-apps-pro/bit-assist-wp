<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

/**
 * Undocumented class
 */
class Response extends Model
{
    protected $casts = [
        'response' => 'object'
    ];

    protected $fillable = [
        'widget_channel_id',
        'response',
    ];

    public function widgetChannel()
    {
        return $this->belongsTo(WidgetChannel::class);
    }
}
