import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 只需要引入 Element Plus 的樣式文件和圖標
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:windi.css'

const app = createApp(App)

// 註冊所有 Element Plus 圖標
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(router)
  .mount('#app') 