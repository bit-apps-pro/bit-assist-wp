<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ApiWidgetController;
use BitApps\Assist\HTTP\Controllers\IframeController;
use BitApps\Assist\HTTP\Controllers\ResponseController;

if (!\defined('ABSPATH')) {
    exit;
}

Route::noAuth()->group(function () {
    Route::post('bitAssistWidget', [ApiWidgetController::class, 'bitAssistWidget']);
    Route::post('responses', [ResponseController::class, 'store']);
    Route::post('wpSearch', [ApiWidgetController::class, 'wpSearch']);
    Route::post('orderDetails', [ApiWidgetController::class, 'orderDetails']);

    Route::get('iframe', [IframeController::class, 'iframe']);
});
