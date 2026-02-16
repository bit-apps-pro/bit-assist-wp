<?php

namespace BitApps\Assist\HTTP\Requests;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

class WidgetChannelUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'widget_id'    => ['required'],
            'channel_name' => ['required'],
            'config'       => ['required'],
            'sequence'     => ['nullable'],
        ];
    }
}
