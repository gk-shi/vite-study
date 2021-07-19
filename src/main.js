import { createApp } from 'vue'
import App from './App.vue'
// import './index.css'
// 由于单独的 css 文件引入需要通过客户端模块(源码的 https://github.com/vitejs/vite/blob/1.x/src/client/client.ts)来更新样式，故没有实现

createApp(App).mount('#app')
