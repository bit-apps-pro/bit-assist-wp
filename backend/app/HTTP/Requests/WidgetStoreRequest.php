<?php

namespace BitApps\Assist\HTTP\Requests;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

class WidgetStoreRequest extends Request
{
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
