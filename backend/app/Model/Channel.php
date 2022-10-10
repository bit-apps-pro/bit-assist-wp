<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

/**
 * Undocumented class.
 */
class Channel extends Model
{
    protected $casts = [
        'default' => 'object'
    ];

    protected $fillable = [
        'name',
        'icon',
        'status',
        'created_at',
    ];
}
