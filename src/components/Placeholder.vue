<script setup>
/**
 * =============================================================================
 * Placeholder —— 统一的「空字段」表达
 *
 * 两条需求要同时成立：
 *   1. 字段留空时渲染「虚线占位块」——这是页面的结构骨架，生产环境也要在；
 *   2. 占位提示文字 + CONFIG 路径标签「只在开发环境显示」，生产构建必须隐藏。
 *
 * 所以两者的开关是分开的：
 *   - 虚线块的形状：永远渲染；
 *   - 块里的文字 / 路径：由 SHOW_HINTS 控制，生产构建时被静态替换为 false，
 *     整段文字连模板一起摇掉；
 *   - 生产环境没有文字可念，给块加 aria-hidden，避免读屏读出空节点。
 *
 * variant：
 *   text  行内短占位（标题、姓名、角色）——开发环境是一行带虚线下划线的字，
 *         生产环境是一个虚线小方块
 *   line  占位条（段落行）
 *   media 图片占位（证件照、截图）
 *   chip  小标签占位（标签、状态徽标）
 * ========================================================================== */
import { SHOW_HINTS } from '../utils/env'

const props = defineProps({
  // 提示文字，例如「姓名」
  label: { type: String, default: '占位' },
  // 配置路径，例如 site.banner.nameZh；仅开发环境显示
  path: { type: String, default: '' },
  // 形态
  variant: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'line', 'media', 'chip'].includes(value),
  },
})

// 生产环境：没有文字，只需要一个「这里还空着」的形状
const isBlank = !SHOW_HINTS
</script>

<template>
  <span
    class="ph"
    :class="[`ph--${props.variant}`, { 'is-blank': isBlank }]"
    :aria-hidden="isBlank ? 'true' : undefined"
  >
    <template v-if="SHOW_HINTS">
      <i v-if="variant === 'media'" class="fa-solid fa-image ph__icon" aria-hidden="true"></i>
      <span class="ph__label">{{ label }}</span>
      <code v-if="path" class="ph__path">{{ path }}</code>
    </template>
  </span>
</template>

<style scoped>
.ph {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-faint);
  font-weight: inherit;
  font-size: 0.75em;
  letter-spacing: 0.01em;
  vertical-align: baseline;
}

/* -----------------------------------------------------------------------------
 * 行内短占位
 * -------------------------------------------------------------------------- */
.ph--text {
  min-width: 3.5em;
  min-height: 1em;
  border-bottom: 1px dashed color-mix(in srgb, var(--line-strong) 70%, transparent);
  padding-bottom: 0.12em;
  flex-wrap: wrap;
}

/* 生产环境：没有字，做成一个看得见的虚线方块，而不是一条无意义的线 */
.ph--text.is-blank {
  min-width: 4.5em;
  height: 1em;
  border: 1px dashed color-mix(in srgb, var(--line-strong) 55%, transparent);
  border-radius: 0.28em;
  background: var(--surface-inset);
  padding: 0;
}

/* -----------------------------------------------------------------------------
 * 占位条：模拟一行文字
 * -------------------------------------------------------------------------- */
.ph--line {
  display: block;
  width: 100%;
  min-height: 0.7rem;
  border-radius: 99px;
  border: 1px dashed color-mix(in srgb, var(--line-strong) 55%, transparent);
  background: var(--surface-inset);
}

/* -----------------------------------------------------------------------------
 * 图片占位：撑满父容器
 * -------------------------------------------------------------------------- */
.ph--media {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  height: 100%;
  min-height: 7rem;
  padding: 1rem;
  border-radius: calc(var(--radius-card) - 0.4rem);
  border: 1px dashed color-mix(in srgb, var(--line-strong) 62%, transparent);
  background: var(--surface-inset);
  text-align: center;
}

/* -----------------------------------------------------------------------------
 * 小标签
 * -------------------------------------------------------------------------- */
.ph--chip {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px dashed color-mix(in srgb, var(--line-strong) 55%, transparent);
  background: var(--surface-inset);
  font-size: 0.75rem;
}

/* 生产环境的空标签：保留胶囊形状，给个最小宽度 */
.ph--chip.is-blank {
  display: inline-block;
  min-width: 3.2rem;
  height: 1.35rem;
  padding: 0;
}

.ph__icon {
  font-size: 1rem;
  opacity: 0.6;
}

.ph__label {
  font-weight: 500;
}

.ph__path {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.1rem 0.4rem;
  border-radius: 99px;
  border: 1px solid var(--line-soft);
  background: var(--surface-inset);
  white-space: nowrap;
  opacity: 0.85;
}

/* 375px 下路径标签太长会挤爆布局：窄屏只保留中文提示 */
@media (max-width: 480px) {
  .ph__path {
    display: none;
  }
}
</style>
