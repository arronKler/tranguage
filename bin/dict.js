#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const queryWord = require('../lib/queryWord.js')

program.version(pkg.version)

const params = Array.prototype.slice.call(process.argv, 2)
program.parse(process.argv)

if (params.length === 0) {
  program.help()
} else {
  queryWord(params.join(' '))
}
