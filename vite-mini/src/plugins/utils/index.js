const { Readable } = require('stream')
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')

exports.readBody = async function (stream) {
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = ''
      stream
        .on('data', chunk => res += chunk)
        .on('error', reject)
        .on('end', () => resolve(res))
    })
  } else {
    return !stream || typeof stream === 'string' ? stream : stream.toString()
  }
}


exports.rewriteImports = (content) => {
  const imports = parse(content)[0]
  const ms = new MagicString(content)
  imports.forEach(imp => {
    const { n, s, e } = imp // n: import from 中 from 的值，s: 开始下标，e: 结束下标
    if (!/^[\.\/]/.test(n)) {
      // 将非  /   ./  ../ 开头的裸模块路径替换
      const id = `/@modules/${n}`
      ms.overwrite(s, e, id)
    }
  })
  return ms.toString()
}