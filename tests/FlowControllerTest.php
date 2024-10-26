<?php

use BitApps\Assist\Deps\BitApps\WPKit\Helpers\JSON;

class TestFlowController extends BaseTestCase
{
    /**
     *
     * @group ajax
     */
    public function testStore()
    {
        $this->call('POST', 'flow/save', [
            'title'     => 'Test Flow',
            'run_count' => 1,
            'map'       => [],
            'tag_id'    => '1,3'
        ]);
        $this->assertIsString($this->_last_response);
        $response = JSON::maybeDecode($this->_last_response);
        $this->assertIsObject($response);
        $this->assertObjectHasAttribute('status', $response);
        $this->assertSame('success', $response->status);
        $this->assertObjectHasAttribute('data', $response);
        $this->assertObjectHasAttribute('id', $response->data);
        $this->assertIsNumeric($response->data->id);
    }

    /**
     *
     * @group ajax
     * @group api
     */
    public function testSearch()
    {
        $this->call('POST', 'flows/search', [
            'searchKeyValue' => [
                'tags'  => ['all'],
                'title' => '',
            ],
            'limit'  => 10,
            'pageNo' => 1
        ]);
        $this->assertIsString($this->_last_response);
        $response = JSON::maybeDecode($this->_last_response);
        $this->assertIsObject($response);
        $this->assertObjectHasAttribute('status', $response);
        $this->assertSame('success', $response->status);
    }
}
