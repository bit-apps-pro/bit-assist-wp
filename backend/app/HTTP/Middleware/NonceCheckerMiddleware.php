<?php

namespace BitApps\Assist\HTTP\Middleware;

use BitApps\Assist\Core\Http\Response;
use BitApps\Assist\Core\Http\Request\Request;

final class NonceCheckerMiddleware
{
    public function handle(Request $request, ...$params)
    {
        if (!$request->has('_ajax_noce') || wp_verify_nonce(sanitize_key($request->_ajax_noce), 'bitflow_noce')) {
            // return Response::error('Invalid token')->httpStatus(411);
        }

        return true;
    }
}
