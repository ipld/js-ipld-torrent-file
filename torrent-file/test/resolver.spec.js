/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const assert = chai.assert
const loadFixture = require('aegir/fixtures')
const CID = require('cids')
const Torrent = require('parse-torrent')
const multihash = require('multihashes')
const multicodec = require('multicodec')

const ipldTorrentFile = require('../index')
const resolver = ipldTorrentFile.resolver

describe('IPLD format resolver (local)', () => {
  const testData = loadFixture('test/fixtures/big-buck-bunny.torrent')
  const testTorrent = Torrent(testData)
  const testBlob = ipldTorrentFile.util.serialize({
    _torrentObj: testTorrent
  })

  it('multicodec is torrent-file', () => {
    expect(ipldTorrentFile.codec).to.equal(multicodec.TORRENT_FILE)
  })

  it('defaultHashAlg is SHA1', () => {
    expect(ipldTorrentFile.defaultHashAlg).to.equal(multicodec.SHA1)
  })

  it('can parse the cid', async () => {
    const cid = await ipldTorrentFile.util.cid(testBlob)
    const encodedCid = cid.toBaseEncodedString()
    const reconstructedCid = new CID(encodedCid)
    expect(cid.version).to.equal(reconstructedCid.version)
    expect(cid.codec).to.equal(reconstructedCid.codec)
    expect(cid.multihash.toString('hex')).to.equal(reconstructedCid.multihash.toString('hex'))
  })

  describe('resolver.resolve', () => {
    it('path within scope', () => {
      const result = resolver.resolve(testBlob, 'pieceLength')
      expect(result.value).to.equal(testTorrent.pieceLength)
    })

    it('resolves "infoHash" to correct type', () => {
      const result = resolver.resolve(testBlob, 'infoHash')
      expect(CID.isCID(result.value)).to.be.true()
    })
  })

  it('resolver.tree', async () => {
    const tree = resolver.tree(testBlob)
    const paths = [...tree]
    assert.includeMembers(paths, [
      'info',
      'name',
      'announce',
      'urlList',
      'pieceLength',
      'pieces',
    ])
  })

  describe('util', () => {
    it('should create CID, no options', async () => {
      const cid = await ipldTorrentFile.util.cid(testBlob)
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-file')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha1')
    })

    it('should create CID, empty options', async () => {
      const cid = await ipldTorrentFile.util.cid(testBlob, {})
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-file')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha1')
    })

    it('should create CID, hashAlg', async () => {
      const cid = await ipldTorrentFile.util.cid(testBlob, {
        hashAlg: multicodec.SHA2_256
      })
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-file')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha2-256')
    })
  })
})
