const { readBody, rewriteImports } = require("./utils")

const moduleRewritePlugin = ({ app }) => {

  app.use(async (ctx, next) => {

    await next()
    
    if (ctx.body && ctx.response.is('js')) {
      // 主要是对 js 文件中 import 的裸模块进行路径重写，
      // 因为浏览器的 ES Module 不支持裸模块的请求加载
      const content = await readBody(ctx.body)
      const result = rewriteImports(content)
      ctx.body = result
    }
  })
}

module.exports = moduleRewritePlugin
