<?php

namespace BitApps\Assist\HTTP\Requests;

use BitApps\Assist\Core\Http\Request\Request;

class WidgetChannelStoreRequest extends Request
{
    public function rules()
    {
        return [
            'widget_id'  => ['required'],
            'channel_id' => ['required'],
            'config'     => ['required'],
            'sequence'   => ['nullable'],
        ];
    }
}
