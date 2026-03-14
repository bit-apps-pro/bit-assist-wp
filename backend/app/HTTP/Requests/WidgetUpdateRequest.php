<?php

namespace BitApps\Assist\HTTP\Requests;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

class WidgetUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'name'                 => ['required', 'string', 'max:255', 'sanitize:text'],
            'styles'               => ['nullable'],
            'initial_delay'        => ['required', 'integer'],
            'page_scroll'          => ['required', 'integer'],
            'widget_behavior'      => ['required', 'integer'],
            'call_to_action.delay' => ['nullable', 'integer'],
            'call_to_action.text'  => ['nullable', 'string', 'sanitize:textarea'],
            'store_responses'      => ['required'],
            'delete_responses'     => ['nullable'],
            'integrations'         => ['nullable', 'array'],
            'status'               => ['required', 'boolean'],
            'hide_credit'          => ['required', 'boolean'],
        ];
    }
}
