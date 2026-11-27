<script setup>
/**
 * =============================================================================
 * ProjectsNav —— 项目页左侧二级菜单
 *
 * 桌面（≥768px）：左侧固定 240px，sticky 跟随滚动
 * 移动（<768px）：折叠成顶部横向滚动 tab，选中项自动滚到可见位置
 *
 * 选中态：主色左边框 + 浅底（.is-active），不做整块高亮。
 * 整项可点击 → 必须带 :focus-visible 焦点样式。
 * ========================================================================== */
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { projects } from '../data/projects'
import Placeholder from './Placeholder.vue'

const route = useRoute()

// 当前 slug：以路由为准，这样「直接访问 URL」时菜单状态天然正确
const activeSlug = computed(() => route.params.slug)

// 移动端横向 tab 容器
const tabListEl = ref(null)

/**
 * 把选中项滚动到可见位置（仅移动端有意义）。
 * 用 scrollIntoView + inline:'center'，比手算 scrollLeft 更稳，
 * 也不会影响到纵向滚动（block:'nearest'）。
 */
async function scrollActiveTabIntoView() {
  await nextTick()
  const container = tabListEl.value
  if (!container) return

  const active = container.querySelector('.is-active')
  if (!active) return

  active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

// 首次进入 + 每次切换项目都对齐一次
watch(activeSlug, scrollActiveTabIntoView, { immediate: true })
</script>

<template>
  <nav class="pnav" aria-label="项目列表">
    <p class="pnav__caption">
      <span>项目</span>
    </p>

    <!-- 同一份列表，两种布局：宽屏竖排、窄屏横排 -->
    <ul ref="tabListEl" class="pnav__list">
      <li v-for="(project, index) in projects" :key="project.slug" class="pnav__item">
        <RouterLink
          class="pnav__link"
          :class="{ 'is-active': activeSlug === project.slug }"
          :to="{ name: 'project', params: { slug: project.slug } }"
          :aria-current="activeSlug === project.slug ? 'page' : undefined"
        >
          <!-- 序号：两位数字，等宽对齐 -->
          <span class="pnav__index">{{ String(index + 1).padStart(2, '0') }}</span>

          <span class="pnav__body">
            <!-- 短名：空值时保留虚线短块（生产环境不出现文字） -->
            <span class="pnav__name">
              <template v-if="project.shortName">{{ project.shortName }}</template>
              <Placeholder v-else label="项目短名" path="shortName" />
            </span>

            <!-- 时间 / 状态 -->
            <span class="pnav__meta">
              <template v-if="project.period">{{ project.period }}</template>
              <Placeholder v-else label="时间 / 状态" path="period" />
            </span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* -----------------------------------------------------------------------------
 * 容器
 * -------------------------------------------------------------------------- */
.pnav {
  min-width: 0;
}

.pnav__caption {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.7rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--line-soft);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.pnav__list {
  display: flex;
  flex-direction: row;
  gap: 0.35rem;
  margin: 0;
  padding: 0 0 0.4rem;
  list-style: none;
  /* 移动端：横向滚动，隐藏滚动条但保留滚动能力 */
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.pnav__list::-webkit-scrollbar {
  display: none;
}

.pnav__item {
  flex: none;
}

/* -----------------------------------------------------------------------------
 * 菜单项
 *
 * 左侧 2px 主色竖线是选中态的主体；未选中时这条线透明，
 * 所以切换时只有颜色变化，不会引起布局位移。
 * -------------------------------------------------------------------------- */
.pnav__link {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border-left: 2px solid transparent;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.24s var(--ease-out-soft),
    background-color 0.24s var(--ease-out-soft),
    border-color 0.24s var(--ease-out-soft);
}

.pnav__link.is-active {
  border-left-color: var(--accent);
  background: var(--accent-soft);
  color: var(--text);
}

@media (hover: hover) and (pointer: fine) {
  .pnav__link:hover {
    color: var(--text);
    background: var(--surface);
  }

  .pnav__link.is-active:hover {
    background: var(--accent-soft);
  }
}

/* 整项可点击，键盘必须看得见焦点 */
.pnav__link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.pnav__index {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: var(--text-faint);
  transition: color 0.24s var(--ease-out-soft);
}

.pnav__link.is-active .pnav__index {
  color: var(--accent);
}

.pnav__body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.pnav__name {
  font-size: 0.875rem;
  font-weight: 550;
  color: inherit;
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pnav__meta {
  font-size: 0.6875rem;
  color: var(--text-faint);
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
}


/* -----------------------------------------------------------------------------
 * 移动端：横向 tab
 * -------------------------------------------------------------------------- */
@media (max-width: 767px) {
  /* 横排时每一项是「序号 + 短名」一行，时间移到小字第二行 */
  .pnav__link {
    align-items: center;
    padding: 0.5rem 0.7rem;
    border-left-width: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .pnav__link.is-active {
    border-left-color: transparent;
    border-bottom-color: var(--accent);
  }

  .pnav__name,
  .pnav__meta {
    max-width: 7.5rem;
  }
}

/* -----------------------------------------------------------------------------
 * 桌面：左侧竖向 sticky
 * -------------------------------------------------------------------------- */
@media (min-width: 768px) {
  .pnav {
    position: sticky;
    /* 顶栏高度 + 一点呼吸 */
    top: 4.75rem;
    align-self: start;
    width: 15rem;
  }

  .pnav__list {
    flex-direction: column;
    gap: 0.15rem;
    padding-bottom: 0;
    overflow: visible;
  }

  .pnav__item {
    flex: initial;
  }

  .pnav__link {
    align-items: flex-start;
    padding: 0.65rem 0.8rem;
  }

  .pnav__body {
    gap: 0.15rem;
  }
}

/* 1280px 及以上给菜单多一点宽度（需求 220–260px） */
@media (min-width: 1280px) {
  .pnav {
    width: 15.5rem;
  }
}
</style>




