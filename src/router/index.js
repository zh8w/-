import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { projects } from '../data/projects'

/**
 * =============================================================================
 * 路由表
 *
 * 三个页面，不多不少：
 *   /                   首页（Banner + 简历 PDF）
 *   /projects           项目页（默认展示第一个项目）
 *   /projects/:slug     项目详情
 *
 * 说明：
 * - History 模式（无 # 号），需要部署端把未知路径回退到 index.html，
 *   见 DEPENDENCIES.md 的「刷新不 404」一节。
 * - 项目详情页懒加载，首屏只下载首页代码。
 * - /projects 用重定向而不是在组件里判断，这样地址栏与菜单状态永远一致。
 * ========================================================================== */

/**
 * 取第一个项目的 slug。
 * 直接读数据而不是硬编码，这样在 projects.js 里调整顺序或新增项目时，
 * 「默认展示第一个项目」始终成立。
 */
function firstSlug() {
  return projects[0]?.slug ?? 'project-1'
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' },
  },
  {
    path: '/projects',
    name: 'projects',
    // 进入项目页时默认展示第一个项目，避免出现「空详情区」
    redirect: () => ({ name: 'project', params: { slug: firstSlug() } }),
  },
  {
    path: '/projects/:slug',
    name: 'project',
    component: () => import('../views/ProjectView.vue'),
    // slug 要做校验，非法值交给组件渲染空态，而不是空白页
    props: true,
  },
  {
    // 兜底：未知地址回首页，不暴露 404 页面（需求要求只有三页）
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  /**
   * 滚动行为：
   * - 前进 / 后退：恢复原来位置（浏览器体验）
   * - 普通点击：回到页面顶部
   * 项目详情页内部的「回到详情顶部」由组件自己处理（见 ProjectView）。
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // 切换项目时保持详情区在顶部，而不是整页跳动
    if (to.name === 'project' && from.name === 'project') return false
    return { top: 0, behavior: 'instant' }
  },
})

/**
 * 路由标题：让浏览器标签页跟着页面走
 * 项目详情页会由组件在拿到数据后再覆盖一次（需要项目名）。
 */
router.afterEach((to) => {
  const titles = {
    home: '首页',
    projects: '项目',
    project: '项目详情',
  }
  const label = titles[to.name] ?? ''
  document.title = label ? `${label} · 作品集` : '作品集'
})

export default router
