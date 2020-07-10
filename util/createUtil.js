const CID = require('cids')
const multicodec = require('multicodec')
const multihashing = require('multihashing-async')
const bencode = require('bencode')

const DEFAULT_HASH_ALG = multicodec.SHA1

module.exports = (codec, deserialize) => {
  return {
    /**
     * Deserialize a torrent file into the internal representation.
     *
     * @param {Buffer} serialized - Binary representation of a torrent file.
     * @returns {Object}
     */
    deserialize,
    /**
     * Serialize internal representation into a binary torrent file.
     *
     * @param {Object} deserialized - Internal representation of a torrent file
     * @returns {Buffer}
     */
    serialize: (deserialized) => {
      delete deserialized._torrentObj.infoHashBuffer
      delete deserialized._torrentObj.infoBuffer
      return bencode.encode(deserialized._torrentObj)
    },
    /**
     * Calculate the CID of the binary blob.
     *
     * @param {Object} binaryBlob - Encoded IPLD Node
     * @param {Object} [userOptions] - Options to create the CID
     * @param {number} [userOptions.cidVersion=1] - CID version number
     * @param {string} [UserOptions.hashAlg] - Defaults to the defaultHashAlg of the format
     * @returns {Promise.<CID>}
     */
    cid: async (binaryBlob, userOptions) => {
      const defaultOptions = { cidVersion: 1, hashAlg: DEFAULT_HASH_ALG }
      const options = Object.assign(defaultOptions, userOptions)

      const multihash = await multihashing(binaryBlob, options.hashAlg)
      const codecName = multicodec.print[codec]
      return new CID(options.cidVersion, codecName, multihash)
    }
  }
}
