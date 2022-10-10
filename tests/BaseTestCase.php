<?php

use BitApps\Assist\Config;
use BitApps\Assist\Core\Http\RequestType;
use BitApps\Assist\Core\Http\Router\Router;
use BitApps\Assist\Plugin;

abstract class BaseTestCase extends WP_Ajax_UnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (defined('TEST_API')) {
            global $wp_rest_server;
            $this->server = new WP_REST_Server();
            $wp_rest_server = $this->server;
            do_action('rest_api_init');
        } else {
            define('DOING_AJAX', true);
        }
    }

    protected function call($method, $route, $data)
    {
        if (defined('TEST_API')) {
            $this->callRest($method, $route, $data);
        } else {
            $this->callAjax($method, $route, $data);
        }
    }

    private function callAjax($method, $route, $data)
    {
        $_SERVER['REQUEST_METHOD'] = $method;
        if (strtoupper($method) === 'GET') {
            $_GET = $data;
        } else {
            $_POST = $data;
        }
        $actionPrefix = '';
        if (
            class_exists(Config::class)
            && \defined(Config::class . '::VAR_PREFIX')
        ) {
            $actionPrefix = Config::VAR_PREFIX;
        }

        $_REQUEST['action'] = $actionPrefix . $route;
        if (is_readable(\dirname(__DIR__) . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'hooks' . DIRECTORY_SEPARATOR . 'ajax.php')) {
            $router = new Router(RequestType::AJAX, Config::VAR_PREFIX, '');
            $router->setMiddlewares(Plugin::instance()->middlewares());
            include \dirname(__DIR__) . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'hooks' . DIRECTORY_SEPARATOR . 'ajax.php';
            $router->register();
        }
        try {
            $this->_handleAjax($actionPrefix . $route);
            $this->fail('Expected exception: WPAjaxDieContinueException');
        } catch (WPAjaxDieContinueException $e) {
            // We expected this, do nothing.
        }
    }

    private function callRest($method, $route, $data)
    {
        $routePrefix = '';
        if (
            class_exists(Config::class)
            && \defined(Config::class . '::SLUG')
        ) {
            $routePrefix = '/' . Config::SLUG . '/v1/';
        }
        $request = new WP_REST_Request($method, $routePrefix . $route);
        $request->set_body_params($data);
        $response = $this->server->dispatch($request);
        $this->_last_response = $response->get_data();
        if (!is_string($this->_last_response)) {
            $this->_last_response = json_encode($response->get_data());
        }
    }
}
