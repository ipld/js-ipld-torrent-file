'use strict'

const CID = require('cids')
const multihashes = require('multihashes')
const multicodec = require('multicodec')

module.exports = (codec, rawhash, options) => {
  // `CID` expects a string for the multicodec
  const codecName = multicodec.print[codec]
  options = options || {}
  const hashAlg = options.hashAlg || 'sha1'
  const version = typeof options.version === 'undefined' ? 1 : options.version
  const multihash = multihashes.encode(rawhash, hashAlg)
  return new CID(version, codecName, multihash)
}