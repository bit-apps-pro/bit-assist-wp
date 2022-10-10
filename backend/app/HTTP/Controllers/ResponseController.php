<?php

namespace BitApps\Assist\HTTP\Controllers;

use BitApps\Assist\Core\Http\Response as Res;
use BitApps\Assist\Core\Http\Request\Request;
use BitApps\Assist\HTTP\Requests\ResponseStoreRequest;
use BitApps\Assist\HTTP\Requests\ResponseUpdateRequest;
use BitApps\Assist\Model\Response;

final class ResponseController
{
    public function index()
    {
        return Response::get(['id', 'name', 'status']);
    }

    public function show(Response $response)
    {
        if ($response->exists()) {
            return $response;
        }
        return Response::error($response);
    }

    public function store(Request $request)
    {
        Response::insert($request->validated());

        return Response::success('ResponseChannel created successfully');
    }

    public function update(Request $request, Response $response)
    {
        $response->update($request->validated());

        return $response->save();
    }

    public function destroy(Response $response)
    {
        $response->delete();

        return Response::success('Response deleted');
    }
}
