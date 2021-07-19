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
    /**
     * 注释的实现方案应该是更为接近库真实的实现方案，
     * 但是由于库里调用了涉及 process.env 的操作，没有做相应的类型预打包处理的话，
     * 只能通过 hack 的方式来塞入，因此最终没有采用
     */
    // const pkgPath = path.resolve(root, 'node_modules', id, 'package.json')
    // const modulePath = path.resolve(root, 'node_modules', id, require(pkgPath).module)
    // const fileContent = fs.readFileSync(modulePath, { encoding: 'utf8' })
    const fileContent = fs.readFileSync(modulesMap[id], { encoding: 'utf8' })
    ctx.type = 'js'
    ctx.body = fileContent
  })
}


module.exports = moduleResolvePlugin
