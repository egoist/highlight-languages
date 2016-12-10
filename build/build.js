const fs = require('fs')
const path = require('path')
const rollup = require('rollup')

// generate source files
const langs = fs.readdirSync('./node_modules/highlight.js/lib/languages')
langs.forEach(lang => {
  const languageName = path.basename(lang, '.js')
  const data = `
import language from 'highlight.js/lib/languages/${lang}'
hljs.registerLanguage('${languageName}', language)`.trim()
  fs.writeFileSync(`./src/${lang}`, data, 'utf8')
})

// compile
Promise.all(langs.map(lang => {
  return rollup.rollup({
    entry: `./src/${lang}`,
    plugins: [
      require('rollup-plugin-commonjs')(),
      require('rollup-plugin-node-resolve')(),
      require('rollup-plugin-uglify')()
    ]
  }).then(bundle => {
    console.log(`building ${lang}...`)
    return bundle.write({
      format: 'iife',
      dest: lang
    })
  })
})).then(() => {
  console.log('done!')
})
