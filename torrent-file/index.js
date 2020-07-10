'use strict'
const Torrent = require('parse-torrent')
const multicodec = require('multicodec')
const cidFromHash = require('../util/cidFromHash')
const createResolver = require('../util/createResolver')

const deserialize = (serialized) => {
  const { infoBuffer, infoHashBuffer, ...torrentObj } = Torrent(serialized)

  const deserialized = {
    ...torrentObj,
    infoHash: cidFromHash(multicodec.TORRENT_INFO, infoHashBuffer),
    _torrentObj: torrentObj
  }

  Object.defineProperty(deserialized, '_torrentObj', { enumerable: false })

  return deserialized
}

module.exports = createResolver(multicodec.TORRENT_FILE, deserialize)
