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

  // 以中间件的形式注册各个插件，结合洋葱模型，需要注意调用顺序
  const resolvePlugins = [
    moduleRewritePlugin,  // 模块路径的重写
    moduleResolvePlugin,  // 模块的解析加载，主要是如 vue 的这种第三方裸模块
    vueCompilerPlugin,  // 解析 .vue 的 sfc 组件
    serveStaticPlugin  // 静态服务插件
  ]

  resolvePlugins.forEach(plugin => plugin && plugin(context))

  return app
}

creteServer().listen(4000, () => console.log('server started at 4000...'))