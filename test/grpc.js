'use strict'
const tman = require('tman')
const assert = require('power-assert')
const GrpcClient = require('../grpc')

tman.suite('Client', function () {
  let client = new GrpcClient('http://192.168.0.21:30700')

  tman.it('subscribe', function * () {
    assert((yield client.subscribe('test_topic', 'test_s_id')) === null)
  })

  tman.it('unsubscribe', function * () {
    assert((yield client.unsubscribe('test_topic', 'test_s_id')) === null)
  })

  tman.it('send', function * () {
    assert((yield client.send([{
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data1'
    }, {
      'to': 'some_topic',
      'collapse_key': 'collapse_key',
      'time_to_live': 60,
      'data': 'data2'
    }])) === null)
  })

  tman.it('getUserClients', function * () {
    let result = yield client.getUserClients('55c02075283447b14c263fe8')

    assert(typeof result.total === 'number')
    assert(typeof result.android === 'number')
    assert(typeof result.ios === 'number')
    assert(typeof result.web === 'number')
  })

  tman.it('sign', function * () {
    assert((yield client.sign('55c02075283447b14c263fe8', 'source', 2000)).length !== 0)
  })
})
