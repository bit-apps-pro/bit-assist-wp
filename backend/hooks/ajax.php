<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ChannelController;
use BitApps\Assist\HTTP\Controllers\ResponseController;
use BitApps\Assist\HTTP\Controllers\WidgetChannelController;
use BitApps\Assist\HTTP\Controllers\WidgetController;

if (!\defined('ABSPATH')) {
    exit;
}

Route::group(function () {
    Route::get('widgets', [WidgetController::class, 'index']);
    Route::get('widgets/{widget}', [WidgetController::class, 'show']);
    Route::post('widgets', [WidgetController::class, 'store']);
    Route::put('widgets/{widget}', [WidgetController::class, 'update']);
    Route::destroy('widgets/{widget}', [WidgetController::class, 'destroy']);
    Route::put('widgets/{widget}/changeStatus', [WidgetController::class, 'changeStatus']);
    Route::put('widgets/{widgetId}/changeActive', [WidgetController::class, 'changeActive']);

    Route::get('channels', [ChannelController::class, 'index']);
    Route::get('channels/{channel}', [ChannelController::class, 'show']);

    Route::get('widgets/{widgetId}/widgetChannels', [WidgetChannelController::class, 'index']);
    Route::get('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'show']);
    Route::post('widgetChannels', [WidgetChannelController::class, 'store']);
    Route::put('widgetChannels/updateSequence', [WidgetChannelController::class, 'updateSequence']);
    Route::put('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'update']);
    Route::destroy('widgetChannels/{widgetChannel}', [WidgetChannelController::class, 'destroy']);

    Route::get('responses/{widgetChannelId}/othersData', [ResponseController::class, 'othersData']);
    Route::get('responses/{widgetChannelId}/{page}/{limit}', [ResponseController::class, 'index']);
    Route::post('responses', [ResponseController::class, 'store']);
    Route::post('responsesDelete', [ResponseController::class, 'destroy']);
})->middleware('nonce:admin');
