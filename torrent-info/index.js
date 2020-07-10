'use strict'
const bencode = require('bencode')
const multicodec = require('multicodec')
const cidFromHash = require('../util/cidFromHash')
const createResolver = require('../util/createResolver')

const deserialize = (serialized) => {
  const torrentObj = bencode.decode(serialized)

  const deserialized = {
    ...torrentObj,
    _torrentObj: torrentObj
  }

  Object.defineProperty(deserialized, '_torrentObj', { enumerable: false })

  return deserialized
}

module.exports = createResolver(multicodec.TORRENT_INFO, deserialize)
