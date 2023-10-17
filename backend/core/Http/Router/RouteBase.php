<?php

namespace BitApps\Assist\Core\Http\Router;

use Closure;
use RuntimeException;
use AllowDynamicProperties;

/**
 * Base class for route
 *
 * @method static RouteRegistrar match($methods, $path, $action)
 * @method static RouteRegistrar get($path, $action)
 * @method static RouteRegistrar post($path, $action)
 * @method static RouteRegistrar getMethods()
 * @method static RouteRegistrar action($action)
 * @method static RouteRegistrar getAction()
 * @method static RouteRegistrar path($path)
 * @method static RouteRegistrar getPath()
 * @method static RouteRegistrar name($name)
 * @method static RouteRegistrar getName()
 * @method static RouteRegistrar isNoAuth()
 * @method static RouteRegistrar isTokenIgnored()
 * @method static RouteRegistrar regex()
 * @method static RouteRegistrar hasRegex()
 * @method static RouteRegistrar handleMiddleware()
 * @method static RouteRegistrar getRoutePrefix()
 * @method static RouteRegistrar getRouteParam($name)
 * @method static RouteRegistrar getRouteParams()
 * @method static RouteRegistrar setRouteParamValue($name, $value)
 * @method static RouteRegistrar getRouteParamValue($name)
 * @method static RouteRegistrar getRouteParamValues()
 * @method static RouteRegistrar setRequest(Request $request)
 * @method static RouteRegistrar getRequest()
 */
#[AllowDynamicProperties]
final class RouteBase
{
    private $_prefix;

    private $_noAuth;

    private $_ignoreToken;

    private $_middleware;

    private static $_isGrouped;

    /**
     * Handle static call to route.
     *
     * @param string $method     Name of method from RouteBase
     * @param mixed  $parameters Params to pass
     *
     * @return RouteRegistrar
     */
    public function __call($method, $parameters)
    {
        if (method_exists(RouteRegistrar::class, $method)) {
            $route = \call_user_func_array([$this->getRegistrar(), $method], $parameters);
            $this->getRouter()->addRoute($route);

            return $route;
        }

        throw new RuntimeException('Undefined method [' . $method . '] called on ' . __CLASS__ . ' class.');
    }

    public static function __callStatic($method, $parameters)
    {
        return (new static())->{$method}(...$parameters);
    }

    /**
     * Sets prefix for route.
     *
     * @param string $prefix prefix for route or route group
     *
     * @return RouteBase
     */
    public function prefix($prefix)
    {
        $this->_prefix = $prefix;

        return $this;
    }

    /**
     * Sets if ajax route is also for frontend request.
     *
     * @return RouteBase
     */
    public function noAuth()
    {
        $this->_noAuth = true;

        return $this;
    }

    /**
     * Returns if ajax route is also for frontend request.
     *
     * @return bool
     */
    public function isNoAuth()
    {
        return $this->_noAuth;
    }

    /**
     * Checks if token ignored for the request.
     *
     * @return bool
     */
    public function isTokenIgnored()
    {
        return $this->_ignoreToken;
    }

    /**
     * Sets if token ignored for request.
     *
     * @return RouteBase
     */
    public function ignoreToken()
    {
        $this->_ignoreToken = true;

        return $this;
    }

    /**
     * Sets middleware for route.
     *
     * @return RouteBase
     */
    public function middleware()
    {
        $this->_middleware = (array) $this->_middleware + \func_get_args();

        return $this;
    }

    /**
     * Returns middleware for this request.
     *
     * @return []
     */
    public function getMiddleware()
    {
        return $this->_middleware;
    }

    /**
     * Return  prefix for request.
     *
     * @return null|string
     */
    public function getRoutePrefix()
    {
        return $this->_prefix;
    }

    /**
     * Sets routes to a group using closure.
     *
     * @param Closure $callback function to set multiple route
     *
     * @return $this
     */
    public function group(Closure $callback)
    {
        self::$_isGrouped = $this;
        $callback();
        self::$_isGrouped = null;

        return $this;
    }

    /**
     * Provides router for this route.
     *
     * @return Router
     */
    public function getRouter()
    {
        if (!isset($this->_router)) {
            $this->_router = Router::instance();
        }

        return $this->_router;
    }

    /**
     * Provides registrar for this route.
     *
     * @return RouteRegistrar
     */
    private function getRegistrar()
    {
        $instance = $this;
        if (!\is_null(self::$_isGrouped)) {
            $instance = self::$_isGrouped;
        }

        return new RouteRegistrar($instance);
    }
}
