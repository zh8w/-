<script setup>
/**
 * =============================================================================
 * HomeView —— 首页
 *
 * 结构：Hero（首屏）→ 简历整页展示
 * 联系方式条 + 版权在全局页脚（SiteFooter），此处不再重复。
 * ========================================================================== */
import HeroBanner from '../components/HeroBanner.vue'
import ResumeViewer from '../components/ResumeViewer.vue'
</script>

<template>
  <div class="home">
    <HeroBanner />
    <ResumeViewer />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: clamp(1.75rem, 4vw, 2.75rem);
}
</style>
