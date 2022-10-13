<?php

namespace BitApps\Assist\Model;

use BitApps\Assist\Core\Database\Model;

/**
 * Undocumented class.
 */
class Channel extends Model
{
    protected $casts = [
        'default' => 'object',
        'status'  => 'int',
    ];

    protected $fillable = [
        'name',
        'icon',
        'status',
        'created_at',
    ];
}
