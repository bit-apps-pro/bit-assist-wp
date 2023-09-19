<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

class Analytics extends Model
{
    protected $table = 'analytics';
    
    protected $casts = [
        'widget_id'   => 'int',
        'channel_id'  => 'int',
        'isVisited'   => 'int',
    ];

    protected $fillable = [
        'widget_id',
        'channel_id',
        'isVisited',
    ];

    public function widget()
    {
        return $this->belongsTo(Widget::class, 'id', 'widget_id');
    }

    public function channel()
    {
        return $this->belongsTo(WidgetChannel::class, 'id', 'channel_id');
    }
}
