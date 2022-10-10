<?php

namespace BitApps\Assist\Core\Http\Router;

/**
 * A forwarder class for RouteBase.
 *
 * @method static RouteBase      middleware()
 * @method static RouteBase      prefix($prefix)
 * @method static RouteBase      noAuth()
 * @method static RouteBase      isNoAuth()
 * @method static RouteBase      isTokenIgnored()
 * @method static RouteBase      ignoreToken()
 * @method static RouteBase      getMiddleware()
 * @method static RouteBase      getRoutePrefix()
 * @method static RouteBase      group(Closure $callback)
 * @method static RouteBase      getRouter()
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
final class Route
{
    /**
     * Handle static call to route.
     *
     * @param string $method     Name of method from RouteBase
     * @param mixed  $parameters Params to pass
     *
     * @return RouteBase
     */
    public function __call($method, $parameters)
    {
        return \call_user_func_array([new RouteBase(), $method], $parameters);
    }

    /**
     * Handle static call to route.
     *
     * @param string $method     Name of method from RouteBase
     * @param mixed  $parameters Params to pass
     *
     * @return RouteBase
     */
    public static function __callStatic($method, $parameters)
    {
        return \call_user_func_array([new RouteBase(), $method], $parameters);
    }
}
