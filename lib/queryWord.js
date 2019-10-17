const request = require('request')
const chalk = require('chalk')
const log = console.log

const icbaSource =
  'http://dict-co.iciba.com/api/dictionary.php?type=json&key=D745FD8529B4C31659754FDDE002AA32&w=${word}'

function isLetters(word) {
  return /^[A-Za-z ]*$/i.test(word)
}

function queryWord(word) {
  if (!isLetters(word)) {
    log(`\n😅 暂时只支持对英文单词查询哦\n`)
    process.exit(1)
  }

  let requestUrl = icbaSource.replace('${word}', encodeURIComponent(word))
  request({ url: requestUrl }, async function(err, response, body) {
    if (err) {
      console.error('Error! \n\n', err)
      process.exit(1)
    }

    if (response.statusCode === 200) {
      try {
        const { symbols } = JSON.parse(body)

        if (symbols.length === 0) {
          console.error('\nNo Result！\n')
          process.exit(1)
        }

        printQueryResult(word, symbols)
      } catch (e) {
        console.error(chalk.red('Error! \n\n'), e)
      }
    }
  })
}

function printQueryResult(word, symbols) {
  const { ph_en, ph_am, parts = [] } = symbols[0] // may have more symbols, fetch just one here
  if (parts.length === 0) {
    log(`\n🤔 查询不到单词: ${chalk.magenta(word)}\n`)
    process.exit(1)
  }

  log()
  log(
    '  ' +
      chalk.bold(word) +
      chalk.magenta(`   英:[${ph_en || '-'}]  美:[${ph_am || '-'}] \n`)
  )

  parts.forEach((part, index) => {
    log(chalk.green(` - ${part.part} ${part.means.join('; ')}`))
  })
}

module.exports = queryWord
