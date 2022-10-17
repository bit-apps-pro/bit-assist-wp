<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

/**
 * Undocumented class.
 */
class Channel extends Model
{
    protected $fillable = [
        'name',
        'icon',
    ];

    public function widgetChannels()
    {
        return $this->hasMany(WidgetChannel::class, 'channel_id', 'id');
    }
}
