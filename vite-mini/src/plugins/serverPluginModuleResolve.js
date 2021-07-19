const path = require('path')
const fs = require('fs')

const moduleReg = /^\/@modules\//

const moduleResolvePlugin = ({ app, root }) => {
  
  app.use(async (ctx, next) => {
    if (!moduleReg.test(ctx.path)) {
      return next()
    }

    const id = ctx.path.replace(moduleReg, '')
    const modulesMap = {
      vue: `${root}/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-browser.js`
    }
    // const pkgPath = path.resolve(root, 'node_modules', id, 'package.json')
    // const modulePath = path.resolve(root, 'node_modules', id, require(pkgPath).module)
    // const fileContent = fs.readFileSync(modulePath, { encoding: 'utf8' })
    const fileContent = fs.readFileSync(modulesMap[id], { encoding: 'utf8' })
    ctx.type = 'js'
    ctx.body = fileContent
    // console.log('pkgPath --- ', pkgPath)
  })
}


module.exports = moduleResolvePlugin
