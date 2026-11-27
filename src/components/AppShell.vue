<script setup>
/**
 * =============================================================================
 * AppShell —— 全站外壳：吸顶导航 + 主题切换 + 移动端抽屉 + 路由出口
 *
 * 顶部三栏：
 *   左  LOGO + 站点名（点击回首页）
 *   中  首页 / 项目（按当前路由高亮）
 *   右  下载简历按钮 + 深浅主题切换
 *
 * 375px 下：中栏导航收进汉堡抽屉，右侧「下载简历」图标化，
 * 保证站点名有足够宽度，不出现文字挤压或换行。
 * ========================================================================== */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { brand, nav, resume } from '../data/site'
import ThemeToggle from './ThemeToggle.vue'
import SiteFooter from './SiteFooter.vue'
import Placeholder from './Placeholder.vue'

const route = useRoute()

/* -----------------------------------------------------------------------------
 * 1. 导航高亮
 *
 * 首页只在 path 恰好为 '/' 时高亮；
 * 项目相关页面（/projects 与 /projects/:slug）都算「项目」。
 * -------------------------------------------------------------------------- */
function isActive(item) {
  if (item.to === '/') return route.path === '/'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

/* -----------------------------------------------------------------------------
 * 2. 移动端抽屉
 *
 * 打开时：锁定 body 滚动 + Esc 关闭 + 路由变化自动关闭。
 * 用 <Transition> 做一个很轻的滑入，不做花哨动画。
 * -------------------------------------------------------------------------- */
const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function closeDrawer() {
  drawerOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape' && drawerOpen.value) closeDrawer()
}

watch(drawerOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

// 路由变化（含点击抽屉里的链接）后收起抽屉
watch(() => route.fullPath, closeDrawer)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

/* -----------------------------------------------------------------------------
 * 3. 下载简历
 *
 * 统一用 <a download>：桌面端直接存盘，移动端由浏览器接管（多数会先预览）。
 * download 属性带上文件名，避免存成 resume(1).pdf 这类命名。
 * -------------------------------------------------------------------------- */
const downloadName = computed(() => resume.downloadName || undefined)
</script>

<template>
  <div class="shell">
    <!-- 背景光场：全站唯一的装饰层，玻璃卡片靠它折射出层次 -->
    <div class="aura" aria-hidden="true"></div>
    <div class="aura-mask" aria-hidden="true"></div>

    <!-- 键盘用户第一个 Tab 即可跳过导航 -->
    <a class="skip-link" href="#main">跳到主要内容</a>

    <!-- =====================================================================
         导航
         ================================================================== -->
    <header class="header">
      <div class="header__row page-shell">
        <!-- 左：LOGO + 站点名 -->
        <RouterLink class="brand" :to="brand.to" aria-label="返回首页">
          <span class="brand__mark" :class="{ 'is-empty': !brand.mark }">
            <template v-if="brand.mark">{{ brand.mark }}</template>
            <span v-else class="brand__mark-ph">LOGO</span>
          </span>
          <span class="brand__name">
            <template v-if="brand.name">{{ brand.name }}</template>
            <Placeholder v-else label="站点名" path="site.brand.name" />
          </span>
        </RouterLink>

        <!-- 中：桌面导航（< 768px 隐藏） -->
        <nav class="header__nav" aria-label="主导航">
          <RouterLink
            v-for="item in nav"
            :key="item.to"
            class="header__link"
            :class="{ 'is-active': isActive(item) }"
            :to="item.to"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- 右：下载简历 + 主题 + 汉堡 -->
        <div class="header__actions">
          <a
            class="header__download"
            :href="resume.downloadHref"
            :download="downloadName"
          >
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span class="header__download-text">下载简历</span>
          </a>

          <ThemeToggle />

          <button
            type="button"
            class="header__burger"
            :aria-expanded="drawerOpen"
            aria-controls="mobile-drawer"
            :aria-label="drawerOpen ? '关闭菜单' : '打开菜单'"
            @click="toggleDrawer"
          >
            <i :class="drawerOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- =====================================================================
         移动端抽屉
         ================================================================== -->
    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer" @click.self="closeDrawer">
        <nav id="mobile-drawer" class="drawer__panel" aria-label="移动端导航">
          <RouterLink
            v-for="item in nav"
            :key="`m-${item.to}`"
            class="drawer__link"
            :class="{ 'is-active': isActive(item) }"
            :to="item.to"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <span>{{ item.label }}</span>
            <i class="fa-solid fa-chevron-right drawer__chevron" aria-hidden="true"></i>
          </RouterLink>

          <a class="drawer__download" :href="resume.downloadHref" :download="downloadName">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span>下载简历</span>
          </a>
        </nav>
      </div>
    </Transition>

    <!-- =====================================================================
         页面内容
         ================================================================== -->
    <main id="main" class="shell__main page-shell">
      <RouterView v-slot="{ Component }">
        <!-- 路由切换淡入：只做透明度，避免布局抖动 -->
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 页脚：首页显示「联系方式 + 版权」一行，其余页面只显示版权 -->
    <SiteFooter />
  </div>
</template>

<style scoped src="../styles/appshell.css"></style>

