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

const ipldTorrentInfo = require('../index')
const resolver = ipldTorrentInfo.resolver

describe('IPLD format resolver (local)', () => {
  const testData = loadFixture('test/fixtures/big-buck-bunny.torrent')
  const testInfo = Torrent(testData).info
  const testBlob = ipldTorrentInfo.util.serialize({
    _torrentObj: testInfo
  })

  it('multicodec is torrent-info', () => {
    expect(ipldTorrentInfo.codec).to.equal(multicodec.TORRENT_INFO)
  })

  it('defaultHashAlg is SHA1', () => {
    expect(ipldTorrentInfo.defaultHashAlg).to.equal(multicodec.SHA1)
  })

  it('can parse the cid', async () => {
    const cid = await ipldTorrentInfo.util.cid(testBlob)
    const encodedCid = cid.toBaseEncodedString()
    const reconstructedCid = new CID(encodedCid)
    expect(cid.version).to.equal(reconstructedCid.version)
    expect(cid.codec).to.equal(reconstructedCid.codec)
    expect(cid.multihash.toString('hex')).to.equal(reconstructedCid.multihash.toString('hex'))
  })

  describe('resolver.resolve', () => {
    it('path within scope', () => {
      const result = resolver.resolve(testBlob, 'name')
      expect(result.value.toString('hex')).to.equal(testInfo.name.toString('hex'))
    })
  })

    it('resolver.tree', async () => {
      const tree = resolver.tree(testBlob)
      const paths = [...tree]
      assert.includeMembers(paths, [
        'files',
        'name',
        'piece length',
        'pieces'
    ])
  })

  describe('util', () => {
    it('should create CID, no options', async () => {
      const cid = await ipldTorrentInfo.util.cid(testBlob)
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-info')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha1')
    })

    it('should create CID, empty options', async () => {
      const cid = await ipldTorrentInfo.util.cid(testBlob, {})
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-info')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha1')
    })

    it('should create CID, hashAlg', async () => {
      const cid = await ipldTorrentInfo.util.cid(testBlob, {
        hashAlg: multicodec.SHA2_256
      })
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('torrent-info')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha2-256')
    })
  })
})
