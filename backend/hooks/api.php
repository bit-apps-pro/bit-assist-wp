<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ApiWidgetController;
use BitApps\Assist\HTTP\Controllers\ResponseController;

if (!\defined('ABSPATH')) {
    exit;
}

Route::noAuth()->group(function () {
    Route::post('bitAssistWidget', [ApiWidgetController::class, 'bitAssistWidget']);
    Route::post('responses', [ResponseController::class, 'store']);
});
