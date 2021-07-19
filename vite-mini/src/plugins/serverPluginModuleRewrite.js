const { readBody, rewriteImports } = require("./utils")

const moduleRewritePlugin = ({ app }) => {

  app.use(async (ctx, next) => {
    await next()
    if (ctx.body && ctx.response.is('js')) {
      const content = await readBody(ctx.body)
      const result = rewriteImports(content)
      ctx.body = result
    }
  })
}

module.exports = moduleRewritePlugin
