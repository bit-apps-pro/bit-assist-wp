<?php

namespace BitApps\Assist\HTTP\Middleware;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Response;
use BitApps\Assist\Deps\BitApps\WPKit\Utils\Capabilities;

final class AdminCheckerMiddleware
{
    public function handle()
    {
        if (!Capabilities::check('manage_options')) {
            return Response::error(__('Access Denied: Only administrators are allowed to make this request', 'bit-assist'))->httpStatus(411);
        }

        return true;
    }
}
