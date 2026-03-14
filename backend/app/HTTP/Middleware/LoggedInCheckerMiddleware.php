<?php

namespace BitApps\Assist\HTTP\Middleware;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Response;

final class LoggedInCheckerMiddleware
{
    public function handle()
    {
        if (!is_user_logged_in()) {
            return Response::error(__('Access Denied: You must be logged in to make this request', 'bit-assist'))->httpStatus(401);
        }

        return true;
    }
}
