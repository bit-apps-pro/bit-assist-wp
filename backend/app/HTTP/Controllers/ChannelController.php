<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Model\Channel;

final class ChannelController
{
    public function index()
    {
        return Channel::orderBy('name')->get(['id', 'name', 'icon']);
    }

    public function show(Channel $channel)
    {
        return $channel;
    }
}
