'use strict'

const parseTorrentFile = require('parse-torrent-file')
// const bencode = require('bencode')

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

}
