<?php

if (!defined('ABSPATH')) {
    exit;
}

// check if the vendor file exists, if not show a notice and return
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    add_action('admin_notices', function () {
        echo '<div class="notice notice-error"><p>Dependency file not found. Please install the plugin again.</p></div>';
    });
    return;
}

// Autoload vendor files.
require_once __DIR__ . '/../vendor/autoload.php';

// Initialize the plugin.
BitApps\Assist\Plugin::load();
