<?php

namespace BitApps\Assist\HTTP\Requests;

use BitApps\Assist\Core\Http\Request\Request;

class WidgetUpdateRequest extends Request
{
    public function rules()
    {
        return [
            'name'             => ['required'],
            'styles'           => ['nullable'],
            'domains'          => ['required'],
            'business_hours'   => ['required'],
            'timezone'         => ['nullable'],
            'exclude_pages'    => ['required'],
            'initial_delay'    => ['required'],
            'page_scroll'      => ['required'],
            'widget_behavior'  => ['required'],
            'custom_css'       => ['nullable'],
            'call_to_action'   => ['nullable'],
            'store_responses'  => ['required'],
            'delete_responses' => ['nullable'],
            'integrations'     => ['required'],
            'status'           => ['required'],
        ];
    }
}
