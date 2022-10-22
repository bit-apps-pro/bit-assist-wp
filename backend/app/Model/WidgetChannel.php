<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

/**
 * Undocumented class
 */
class WidgetChannel extends Model
{
    protected $casts = [
        'config'   => 'object',
        'sequence' => 'int',
        'status'   => 'int',
    ];

    protected $fillable = [
        'widget_id',
        'channel_name',
        'config',
        'sequence',
        'status',
    ];

    public function widget()
    {
        return $this->belongsTo(Widget::class, 'id', 'widget_id');
    }

    public function responses()
    {
        return $this->hasMany(Response::class, 'widget_channel_id', 'id');
    }
}
