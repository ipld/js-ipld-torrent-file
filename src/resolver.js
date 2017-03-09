'use strict'

const util = require('./util')
const setImmediate = require('async/setImmediate')
const traverse = require('traverse')

exports = module.exports

exports.multicodec = 'torrent-file'

exports.resolve = (block, path, callback) => {
  if (typeof path === 'function') {
    callback = path
    path = undefined
  }

  util.deserialize(block.data, (err, node) => {
    if (err) {
      return callback(err)
    }

    // root
    if (!path || path === '/') {
      return callback(null, {
        value: node,
        remainderPath: ''
      })
    }

    const parts = path.split('/')
    const val = traverse(node).get(parts)

    console.log(node)

    if (val) {
      // TODO if it is a link to a piece, return a CID of a raw block
      return callback(null, {
        value: val,
        remainderPath: ''
      })
    }

    // out of scope
    // TODO
  })
}

// TODO implement when needed
exports.tree = (block, options, callback) => {
  setImmediate(() => callback(new Error('not implemented')))
}
