/* @flow */
'use strict'

/* ::
import type {BmGetRequest} from '../../../types.js'
*/

/* ::
import type {BmPutRequest} from '../../../types.js'
*/

/* ::
import type {BmResponse} from '../../../types.js'
*/

const test = require('blue-tape')
const boom = require('boom')
const td = require('testdouble')

test('Should throw bad implementation if library fails', (t) => {
  // setup stub of library
  const s3urls = td.replace('../../../lib/s3-urls.js')
  td.when(
    s3urls()
    ).thenReject('Couldnt retrieve URLs')

  const request /*: BmGetRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:'
    }
  }

  const api = require('../../../api/v1/signedURL.js')
  api.get(request)
  .catch((err) => {
    console.log('In promise catch: ' + err)
    t.deepEqual(err, boom.badImplementation('Error calling S3 to retrieve signed URLs: Couldnt retrieve URLs'))
  })

  t.end()
})

test('Should return id when id passed', t => {
  // setup stub of library
  const response /*: BmResponse */= {
    postUrl: 'put',
    getUrl: 'get',
    id: 'test123'
  }
  const s3urls = td.replace('../../../lib/s3-urls.js')
  td.when(
    s3urls('test123')
    ).thenResolve(response)

  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {
        id: 'test123'
      }
    }
  }

  const api = require('../../../api/v1/signedURL.js')
  api.put(request)
  .then((res) => {
    console.log('In promise then: ', res)
    t.equal(res.id, 'test123')
  })

  t.end()
})

test('Should reject when id not passed in', t => {
  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {}
    }
  }

  const api = require('../../../api/v1/signedURL.js')

  try {
    api.put(request)
  } catch (err) {
    t.deepEqual(err, boom.badRequest('Please provide id', 'id'))
  }
  t.end()
})
