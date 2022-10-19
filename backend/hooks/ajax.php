<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ChannelController;
use BitApps\Assist\HTTP\Controllers\ResponseController;
use BitApps\Assist\HTTP\Controllers\WidgetChannelController;
use BitApps\Assist\HTTP\Controllers\WidgetController;

if (!\defined('ABSPATH')) {
    exit;
}

if (!headers_sent()) {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    header('Access-Control-Allow-Origin: *');

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);

        exit;
    }
}

Route::noAuth()->group(function () {
    Route::get('widgets', [WidgetController::class, 'index']);
    Route::get('widgets/{widget}', [WidgetController::class, 'show']);
    Route::post('widgets', [WidgetController::class, 'store']);
    Route::put('widgets/{widget}', [WidgetController::class, 'update']);
    Route::destroy('widgets/{widget}', [WidgetController::class, 'destroy']);
    Route::put('widgets/{widget}/changeStatus', [WidgetController::class, 'changeStatus']);
    Route::put('widgets/{widget}/changeActive', [WidgetController::class, 'changeActive']);

    Route::get('channels', [ChannelController::class, 'index']);
    Route::get('channels/{channel}', [ChannelController::class, 'show']);

    Route::get('widgets/{widgetId}/widgetChannels', [WidgetChannelController::class, 'index']);
    Route::get('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'show']);
    Route::post('widgetChannels', [WidgetChannelController::class, 'store']);
    Route::put('widgetChannels/updateSequence', [WidgetChannelController::class, 'updateSequence']);
    Route::put('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'update']);
    Route::destroy('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'destroy']);

    Route::post('responses/{widgetChannelId}', [ResponseController::class, 'index']);
    Route::get('responses/{widgetChannelId}/othersData', [ResponseController::class, 'othersData']);
    Route::post('responses', [ResponseController::class, 'store']);
    Route::post('responsesDelete', [ResponseController::class, 'destroy']);
})->middleware('nonce:admin');
