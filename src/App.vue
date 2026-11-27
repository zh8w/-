<script setup>
/**
 * App.vue —— 根组件
 *
 * 职责只有一件：挂载持久外壳 AppShell。
 * AppShell 内部持有 <RouterView>，所以导航、主题、页脚在页面切换时不会被重建，
 * 只有主内容区在换。
 */
import AppShell from './components/AppShell.vue'
</script>

<template>
  <AppShell />
</template>
