<script setup>
/**
 * =============================================================================
 * ResumeViewer —— 简历整页展示
 *
 * 渲染方式：一张 A4 整页图片（public/resume-page.png），宽度 100%、高度 auto。
 * 容器只负责圆角 / 描边 / 居中，不设固定高度，因此：
 *   - 页面本身自然滚动，一屏能看到整张简历；
 *   - 任何宽度下都不出现内部滚动条，也不会截断内容。
 *
 * 已移除的旧逻辑（本次改动）：
 *   - iframe + #view=FitH&toolbar=0 的 PDF 内嵌阅读器
 *   - matchMedia 1024px 断点切换（桌面 iframe / 移动长图两套方案）
 *   - 72vh 固定高度容器
 *   - 右下角 fixed 浮动按钮（下载 / 新窗口）
 *
 * 保留下来的两个入口在顶部工具栏里（静态，不 fixed、不 sticky）。
 * ========================================================================== */
import { computed } from 'vue'
import { resume } from '../data/site'

// 下载文件名（没填就让浏览器按 URL 决定，避免存成 resume(1).pdf）
const downloadName = computed(() => resume.downloadName || undefined)
</script>

<template>
  <section class="resume" aria-labelledby="resume-title">
    <!-- 区块标题 -->
    <div class="resume__head">
      <h2 id="resume-title" class="resume__title">
        简历
        <span class="resume__title-en">Resume</span>
      </h2>
    </div>

    <!-- =====================================================================
         展示卡：工具栏 + 整页图片
         ================================================================== -->
    <div class="resume__card">
      <!-- 顶部工具栏：静态一行，不 fixed / 不 sticky -->
      <div class="resume__bar">
        <p class="resume__file">
          <i class="fa-solid fa-file-pdf resume__file-icon" aria-hidden="true"></i>
          <span class="resume__file-name">{{ resume.fileName }}</span>
          <span class="resume__file-sep" aria-hidden="true">·</span>
          <span class="resume__file-meta">{{ resume.pageHint }}</span>
        </p>

        <div class="resume__bar-actions">
          <a class="resume__action" :href="resume.downloadHref" :download="downloadName">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span>{{ resume.downloadLabel }}</span>
          </a>
          <a
            class="resume__action"
            :href="resume.openHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            <span>{{ resume.openLabel }}</span>
          </a>
        </div>
      </div>

      <!-- 整页图片：宽度 100%，高度自适应，不做任何裁切 -->
      <div class="resume__page">
        <a
          class="resume__page-link"
          :href="resume.openHref"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="resume.zoomHint"
        >
          <img
            class="resume__image"
            :src="resume.imageSrc"
            :alt="resume.imageAlt"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>

      <!-- 移动端提示：点击图片查看原图 -->
      <p class="resume__zoom-hint">
        <i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>
        <span>{{ resume.zoomHint }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped src="../styles/resumeviewer.css"></style>
