'use strict'
const tman = require('tman')
const assert = require('power-assert')
const AuthClient = require('tws-auth')
const Client = require('../lib/http')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

tman.suite('Client', function () {
  let client = new Client({ host: 'https://121.196.214.67:31094' })
  let authClient = new AuthClient({
    host: 'http://121.196.214.67:31090',
    appId: '59294da476d70b4b83fa91a5',
    appSecret: process.env.APP_SECRET,
    timeout: 30000
  })

  let token
  tman.before(function * () {
    token = yield authClient.auth.authorize('59294da476d70b4b83fa91a5', 'self')
  })

  tman.it('subscribe', function * () {
    assert((yield client.subscribe('test_topic', 'test_s_id', token)) === null)
  })

  tman.it('unsubscribe', function * () {
    assert((yield client.unsubscribe('test_topic', 'test_s_id', token)) === null)
  })

  tman.it('send', function * () {
    assert((yield client.send([{
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data1'
    }, {
      to: 'some_topic',
      collapse_key: 'collapse_key',
      time_to_live: 60,
      data: 'data2'
    }], token)) === null)
  })

  tman.it('getUserClients', function * () {
    let result = yield client.getUserClients('59294da476d70b4b83fa91a0', token)

    assert(typeof result.total === 'number')
    assert(typeof result.android === 'number')
    assert(typeof result.ios === 'number')
    assert(typeof result.web === 'number')
  })

  tman.it('sign', function * () {
    assert((yield client.sign('59294da476d70b4b83fa91a0', 'source', 2000, token)).length !== 0)
  })
})
