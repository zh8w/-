/**
 * 环境开关
 *
 * 需求：占位提示文字、CONFIG 路径标签「只在开发环境显示」，
 * 生产构建必须完全隐藏（既不显示文字，也不占视觉噪音）。
 *
 * Vite 在构建时会把 import.meta.env.DEV 静态替换成 true / false，
 * 生产包里这段判断会被摇树优化掉，不会留下可点击的「配置路径」线索。
 */
export const SHOW_HINTS = import.meta.env.DEV

/**
 * 统一的配置路径标签构造器（仅开发环境有用）
 * @param {string} path 例如 'site.banner.nameZh'
 * @returns {string} 生产环境返回空串
 */
export function hint(path) {
  return SHOW_HINTS ? path : ''
}
