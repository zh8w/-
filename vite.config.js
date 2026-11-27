import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite 配置
 * - @vitejs/plugin-vue：编译 .vue 单文件组件
 * - @tailwindcss/vite：Tailwind CSS v4 的官方 Vite 插件（无需 postcss.config）
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    // 骨架页体积很小，关闭内联小资源以外的额外配置即可
    cssCodeSplit: false,
  },
})
