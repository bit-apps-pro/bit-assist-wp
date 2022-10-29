<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ResponseController;
use BitApps\Assist\HTTP\Controllers\WidgetController;

if (!\defined('ABSPATH')) {
    exit;
}

Route::group(function () {
    Route::post('bitAssistWidget', [WidgetController::class, 'bitAssistWidget']);
    Route::post('responses', [ResponseController::class, 'store']);
});
