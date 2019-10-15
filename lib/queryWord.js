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
        console.error(chalk.red('Error! \n\n'), e)
      }
    }
  })
}

function printQueryResult(result) {
  const { key, ps = [], pos, acceptation } = result.dict
  if (!pos || !pos) {
    log(`\n查询不到单词: ${chalk.magenta(key.join(' '))}\n`)
    process.exit(1)
  }

  log()
  log(
    '  ' +
      chalk.bold(key.join(' ')) +
      chalk.magenta(`   英:[${ps[0] || '-'}]  美:[${ps[1] || '-'}] \n`)
  )

  pos.forEach((pos, index) => {
    log(chalk.green(` - ${pos} ${acceptation[index].replace('\r\n', '')}`))
  })
}

module.exports = queryWord
