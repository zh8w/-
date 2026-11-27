import { createApp } from 'vue'

/* ---------- 字体：Archivo 可变字体（自托管，仅按需下载 latin 子集） ---------- */
import '@fontsource-variable/archivo/standard.css'

/* ---------- 图标：FontAwesome ----------
 * 只引入 core + solid + brands，不引 all.css（会把 regular/light 等一并打包）。
 * 字体文件「用到才下载」，不会拖慢首屏。
 * 【注意】如需 regular（线性）图标，在此追加一行：
 *   import '@fortawesome/fontawesome-free/css/regular.min.css'
 */
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'

/* ---------- TailwindCSS v4 入口（由 @tailwindcss/vite 处理） ---------- */
import './style.css'

import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
