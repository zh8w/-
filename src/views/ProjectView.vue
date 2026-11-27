<script setup>
/**
 * =============================================================================
 * ProjectView —— 项目页（/projects/:slug）
 *
 * 左侧：ProjectsNav（4 个项目的二级菜单）
 * 右侧：ProjectDetail（固定五段结构）
 *
 * 交互：
 * - 菜单点击走 <RouterLink>，路由变化 → 详情内容随之切换；
 * - 详情切换后把「详情区」滚回顶部（而不是整页跳回顶部），
 *   这样左侧菜单的位置不会丢；
 * - 内容用 <Transition> 淡入，淡入只做透明度，避免布局抖动；
 * - 每个项目都有独立 URL，可直接打开 / 刷新。
 * ========================================================================== */
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findProject } from '../data/projects'
import ProjectsNav from '../components/ProjectsNav.vue'
import ProjectDetail from '../components/ProjectDetail.vue'

const route = useRoute()

// 按 slug 取数据；非法 slug 返回 null，由 ProjectDetail 渲染空态
const project = computed(() => findProject(route.params.slug))

// 详情区容器：切换后只滚它，不动整个页面
const detailEl = ref(null)

/**
 * 切换项目后，把详情区滚回顶部。
 *
 * 用 scrollIntoView 而不是 window.scrollTo：
 * 详情区在桌面端是右栏，它自己的顶部才是「详情开始的地方」。
 * block:'start' + 少量负偏移，让标题不被吸顶导航压住。
 */
async function scrollDetailToTop() {
  await nextTick()
  const element = detailEl.value
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - 88
  // 已经在顶部附近就不要动，避免「点了没反应却又抖一下」
  if (Math.abs(window.scrollY - top) < 4) return
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
}

// 只在「项目之间切换」时滚动；从别的页面进来时由 router 的 scrollBehavior 处理
watch(
  () => route.params.slug,
  (next, prev) => {
    if (prev !== undefined && next !== prev) scrollDetailToTop()
  },
)

// 拿到项目名后覆盖一次浏览器标题（router.afterEach 里只能给通用标题）
watch(
  project,
  (value) => {
    if (value?.name) document.title = `${value.name} · 作品集`
  },
  { immediate: true },
)
</script>

<template>
  <div class="projects">
    <!-- 左：二级菜单（移动端变顶部横向 tab） -->
    <ProjectsNav class="projects__nav" />

    <!-- 右：详情 -->
    <div ref="detailEl" class="projects__detail">
      <Transition name="detail-fade" mode="out-in">
        <ProjectDetail :key="route.params.slug" :project="project" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* 移动端：上下堆叠（菜单在上，详情在下） */
.projects {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 3vw, 1.75rem);
  align-items: start;
}

.projects__nav {
  min-width: 0;
}

.projects__detail {
  min-width: 0;
}

/* 详情淡入：只动透明度，不动位置 */
.detail-fade-enter-active {
  transition: opacity 0.24s var(--ease-out-soft);
}

.detail-fade-leave-active {
  transition: opacity 0.12s var(--ease-out-soft);
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
}

/* 768px 起：左固定菜单 + 右详情 */
@media (min-width: 768px) {
  .projects {
    /* 15rem 落在需求的 220–260px 区间（15rem = 240px） */
    grid-template-columns: 15rem minmax(0, 1fr);
    gap: clamp(1.5rem, 3vw, 2.5rem);
  }
}

@media (min-width: 1280px) {
  .projects {
    grid-template-columns: 15.5rem minmax(0, 1fr);
  }
}
</style>
