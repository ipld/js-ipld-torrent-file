/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const torrent = require('../src')
const resolver = torrent.resolver
const Block = require('ipfs-block')
const loadFixture = require('aegir/fixtures')

const bitloveIntro = loadFixture(__dirname, '/fixtures/bitlove-intro.torrent')

describe('IPLD format resolver (local)', () => {
  let block
  let node

  before((done) => {
    block = new Block(bitloveIntro)
    torrent.util.deserialize(bitloveIntro, (err, _node) => {
      expect(err).to.not.exist
      node = _node
      done()
    })
  })

  it('multicodec is torrent-file', () => {
    expect(resolver.multicodec).to.equal('torrent-file')
  })

  describe('.resolve', () => {
    it('root', (done) => {
      resolver.resolve(block, '/', (err, result) => {
        expect(err).to.not.exist
        expect(result.value).to.eql(node)
        done()
      })
    })

    it.skip('path within scope that is not a link', (done) => {
      resolver.resolve(block, '/createdBy', (err, result) => {
        expect(err).to.not.exist
        expect(result.value).to.eql('')
        done()
      })
    })

    it.skip('path within scope that is a link', (done) => {})

    it.skip('path out of scope', (done) => {})
  })

  describe('.tree', () => {})
})
