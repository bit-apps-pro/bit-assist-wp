<?php

namespace BitApps\Assist\HTTP\Requests;

use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;

class WidgetUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'name'             => ['required'],
            'styles'           => ['nullable'],
            'domains'          => ['nullable', 'array'],
            'business_hours'   => ['nullable', 'array'],
            'timezone'         => ['nullable'],
            'exclude_pages'    => ['nullable', 'array'],
            'initial_delay'    => ['required'],
            'page_scroll'      => ['required'],
            'widget_behavior'  => ['required'],
            'custom_css'       => ['nullable'],
            'call_to_action'   => ['nullable'],
            'store_responses'  => ['required'],
            'delete_responses' => ['nullable'],
            'integrations'     => ['nullable', 'array'],
            'status'           => ['required'],
        ];
    }
}
