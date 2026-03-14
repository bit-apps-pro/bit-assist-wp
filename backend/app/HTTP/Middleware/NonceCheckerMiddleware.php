<?php

namespace BitApps\Assist\HTTP\Middleware;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Assist\Deps\BitApps\WPKit\Http\Request\Request;
use BitApps\Assist\Deps\BitApps\WPKit\Http\Response;

final class NonceCheckerMiddleware
{
    public function handle(Request $request, ...$params)
    {
        if (!$request->has('_ajax_nonce') || !wp_verify_nonce(sanitize_key($request->_ajax_nonce), 'bit_assist_nonce')) {
            return Response::error(__('Invalid token', 'bit-assist'))->httpStatus(411);
        }

        return true;
    }
}
