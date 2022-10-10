<?php

use BitApps\Assist\Core\Http\Router\Route;
use BitApps\Assist\HTTP\Controllers\ChannelController;

if (!\defined('ABSPATH')) {
    exit;
}

Route::noAuth()->group(function () {
    Route::get('channels', [ChannelController::class, 'store']);
});
