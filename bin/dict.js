#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const word = require('../lib/word.js')

program.version(pkg.version)

program.on('--help', function() {
  const log = console.log
  log('Usage: t [word]')
  log()
  log('Options:')
  log('   --help        Get help')
  log()
  log()
})

program.parse(process.argv)

word(Array.prototype.slice.call(process.argv, 2).join(' '))
