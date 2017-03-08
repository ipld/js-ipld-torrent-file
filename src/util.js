'use strict'

const parseTorrentFile = require('parse-torrent-file')
// const bencode = require('bencode')
const resolver = require('./resolver')
const waterfall = require('async/waterfall')
const multihashing = require('multihashing-async')
const CID = require('cids')

exports = module.exports

exports.serialize = (dagNode, callback) => {
  let serialized
  try {
    serialized = parseTorrentFile.encode(dagNode)
  } catch (err) {
    return callback(err)
  }
  callback(null, serialized)
}

exports.deserialize = (data, callback) => {
  let node
  try {
    node = parseTorrentFile(data)
  } catch (err) {
    return callback(err)
  }
  callback(null, node)
}

exports.cid = (dagNode, callback) => {
  waterfall([
    (cb) => exports.serialize(dagNode, cb),
    (serialized, cb) => {
      multihashing(serialized, 'sha2-256', cb)
    },
    (mh, cb) => cb(null, new CID(1, resolver.multicodec, mh))
  ], callback)
}
