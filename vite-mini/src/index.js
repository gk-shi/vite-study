const Koa = require('koa')
const moduleResolvePlugin = require('./plugins/serverPluginModuleResolve')
const moduleRewritePlugin = require('./plugins/serverPluginModuleRewrite')
const serveStaticPlugin = require('./plugins/serverPluginServeStatic')
const vueCompilerPlugin = require('./plugins/serverPluginVue')



const creteServer = () => {
  const app = new Koa()

  // 上下文内容
  const context = {
    app,  // koa 实例
    root: process.cwd() // 项目根目录路径
  }

  const resolvePlugins = [
    moduleRewritePlugin,  // 模块路径的重写
    moduleResolvePlugin,  // 模块的解析加载
    vueCompilerPlugin,  // 解析 .vue 的 sfc 组件
    serveStaticPlugin  // 静态服务插件
  ]

  resolvePlugins.forEach(plugin => plugin && plugin(context))

  return app
}

creteServer().listen(4000, () => console.log('server is starting at 4000...'))