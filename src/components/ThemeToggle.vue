<script setup>
/**
 * ThemeToggle —— 深浅主题一键切换
 *
 * 逻辑在 composables/useTheme.js；这里只负责按钮语义与图标过渡。
 * aria-label 随当前主题变化，读屏用户能听到「点击后会切成什么」。
 */
import { useTheme } from '../composables/useTheme'

const { toggleTheme, toggleLabel } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="toggleTheme"
  >
    <!-- 两个图标叠放，由 CSS 依据 data-theme 交叉淡入淡出（不做旋转甩动） -->
    <i class="fa-solid fa-sun toggle-icon icon-sun" aria-hidden="true"></i>
    <i class="fa-solid fa-moon toggle-icon icon-moon" aria-hidden="true"></i>
  </button>
</template>
