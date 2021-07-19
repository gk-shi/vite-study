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
      // 对模板的获取解析
      const vueTransformAssetUrls = { base: path.posix.dirname(ctx.path) }
      // transformAssetUrls 加上该属性能够让涉及图片资源的模板将图片视为静态资源地址加载，
      // 否则会认为是一个用 ES Module 引入的资源，无法正常加载显示
      const { code } = compileTemplate({ source: template.content, transformAssetUrls: vueTransformAssetUrls })
      ctx.type = 'js'
      ctx.body = code
    } else if (ctx.query.type === 'script') {
      // 单文件组件可以分为 template script style 三个模块
      // 哪里更新了就通知哪个模块进行热替换，
      // 这里指实现了 template ，其他模块是一样的，
      // 但由于涉及到了 hmr 的话较为复杂，并没有写
    }
  })
}

module.exports = vueCompilerPlugin
