const path = require('path')
const fs = require('fs')

const vueCompilerPlugin = ({ app, root }) => {
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue')) {
      return next()
    }

    const filePath = path.join(root, ctx.path)
    const content = fs.readFileSync(filePath, { encoding: 'utf8' })

    const { parse, compileTemplate } = require(path.resolve(root, 'node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js'))
    const { descriptor = {} } = parse(content)
    const { script, template } = descriptor

    let newContent = ''
    if (!ctx.query.type) {
      // 请求的路径是 /App.vue 而非 /App.vue?type=template 类型
      // 先渲染 script 标签部分，注入部分代码，让客户端单独发请求响应模板
      
      if (script) {
        newContent += script.content.replace(/((?:(^|\n|;))\s*)export default/, '$1const __script =')
      }
      if (template) {
        newContent += `\nimport { render as __render } from "${ctx.path}?type=template"`
        newContent += '\n__script.render = __render'
        newContent += '\nexport default __script'
      }
      ctx.type = 'js'
      ctx.body = newContent
    } else if (ctx.query.type === 'template') {
      const vueTransformAssetUrls = { base: path.posix.dirname(ctx.path) }
      const { code } = compileTemplate({ source: template.content, transformAssetUrls: vueTransformAssetUrls })
      ctx.type = 'js'
      ctx.body = code
    }
  })
}

module.exports = vueCompilerPlugin
