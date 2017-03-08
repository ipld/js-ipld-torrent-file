/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const loadFixture = require('aegir/fixtures')
const torrent = require('../src')

const bitloveIntro = loadFixture(__dirname, '/fixtures/bitlove-intro.torrent')

describe('util', () => {
  it('.deserialize', (done) => {
    torrent.util.deserialize(bitloveIntro, (err, node) => {
      expect(err).to.not.exist
      // console.log(JSON.stringify(node, '', 2))
      done()
    })
  })

  it('.serialize', (done) => {
    torrent.util.deserialize(bitloveIntro, (err, node) => {
      expect(err).to.not.exist
      torrent.util.serialize(node, (err, torrentFile) => {
        expect(err).to.not.exist
        expect(bitloveIntro).to.eql(torrentFile)
        done()
      })
    })
  })

  it.skip('.cid', (done) => {})
})
