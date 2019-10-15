const request = require('request')
const xml2js = require('xml2js')
const chalk = require('chalk')
const log = console.log

const icbaSource =
  'http://dict-co.iciba.com/api/dictionary.php?key=D745FD8529B4C31659754FDDE002AA32&w=${word}'

function queryWord(word) {
  let requestUrl = icbaSource.replace('${word}', word)
  request({ url: requestUrl }, async function(err, response, body) {
    if (response.statusCode === 200) {
      try {
        let result = await xml2js.parseStringPromise(body)
        printQueryResult(result)
      } catch (e) {
        console.error('Wrong! \n', e)
      }
    }
  })
}

function printQueryResult(result) {
  // log(result)
  const { key, ps, pron, pos, acceptation, sent } = result.dict
  if (!ps || !pos || !pos) {
    log('No result!')
    process.exit(1)
  }

  log()
  log(
    '  ' +
      key.join(' ') +
      chalk.magenta(`   英:[${ps[0] || ''}]  美:[${ps[1] || ''}] \n`)
  )
  pos.forEach((pos, index) => {
    log(chalk.green(` - ${pos} ${acceptation[index].replace('\r\n', '')}`))
  })
  // log(acceptation)
  // log(sent)
}

module.exports = function(word, options) {
  queryWord(word)
}
