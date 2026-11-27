import { computed, ref } from 'vue'

/**
 * 深浅主题
 *
 * 设计要点：
 * - 主题状态写在 <html data-theme="dark|light">，配色由 CSS 变量接管，零重渲染；
 * - 首屏主题由 index.html 的内联脚本预先写好，避免「先亮后暗」；
 * - 默认亮色：没有 localStorage 记录时用 light，用户手动切换后以记录为准；
 * - 状态放在模块作用域，任何组件调用 useTheme() 拿到的都是同一份；
 * - 切换时同步 <meta name="theme-color">，移动端地址栏跟着变。
 */

export const THEME_KEY = 'portfolio-theme'

/** 默认主题：亮色 */
export const DEFAULT_THEME = 'light'

const theme = ref(DEFAULT_THEME)
let initialized = false

function applyTheme(nextTheme) {
  theme.value = nextTheme
  if (typeof document === 'undefined') return

  document.documentElement.setAttribute('data-theme', nextTheme)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', nextTheme === 'dark' ? '#07080d' : '#f1f2f8')
}

/** 读取内联脚本已经写入的主题，保持 JS 状态与 DOM 一致 */
function initTheme() {
  if (initialized || typeof document === 'undefined') return
  initialized = true

  // 内联脚本已经把「localStorage 记录」或「默认亮色」写进 data-theme，
  // 这里只做读取，不再覆盖，避免与首帧不一致
  const current = document.documentElement.getAttribute('data-theme')
  theme.value = current === 'dark' ? 'dark' : 'light'

  // 首帧之后才开启颜色过渡，避免页面刚加载就整体「渐变」一下
  window.requestAnimationFrame(() => {
    document.documentElement.setAttribute('data-theme-ready', '')
  })
}

export function useTheme() {
  initTheme()

  function persist(nextTheme) {
    try {
      window.localStorage.setItem(THEME_KEY, nextTheme)
    } catch (error) {
      // 隐私模式 / 禁用存储时忽略，不影响本次浏览
    }
  }

  function setTheme(nextTheme) {
    if (nextTheme !== 'dark' && nextTheme !== 'light') return
    applyTheme(nextTheme)
    persist(nextTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // 提示「点击后会切换成什么」，比描述当前状态更符合按钮语义
  const toggleLabel = computed(() =>
    theme.value === 'dark' ? '切换到浅色模式' : '切换到深色模式',
  )

  return { theme, toggleTheme, setTheme, toggleLabel }
}
