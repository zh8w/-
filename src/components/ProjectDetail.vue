<script setup>
/**
 * =============================================================================
 * ProjectDetail —— 项目详情（结构固定五段）
 *
 * ① 头部：时间区间 / 我的角色 / 技术标签 / 一句话价值
 * ② 背景与目标：2–3 段
 * ③ 遇到的难题：现象 → 定位 → 做法 → 验证（编号 + 左侧竖线，不再套卡片）
 * ④ 结果与数据：2–4 个指标，数字加大加粗
 * ⑤ 截图 / 演示：1–3 个占位框 + 说明文字
 *
 * 空态：任何字段为空都渲染虚线占位块 + 字段名（仅开发环境显示字段名）。
 * ========================================================================== */
import { computed, ref } from 'vue'
import { PLACEHOLDER_COUNTS } from '../data/projects'
import { SHOW_HINTS } from '../utils/env'
import Placeholder from './Placeholder.vue'

const props = defineProps({
  // 由路由 props 传入；找不到对应项目时为 null
  project: { type: Object, default: null },
})

/** 数组字段为空时，按预设数量补齐占位条目 */
function withPlaceholders(list, count, factory) {
  if (list && list.length) return list.map((item) => ({ data: item, empty: false }))
  return Array.from({ length: count }, (_, index) => ({ data: factory(index), empty: true }))
}

const tags = computed(() => {
  const list = props.project?.tags ?? []
  return list.length
    ? list.map((tag) => ({ value: tag, empty: false }))
    : Array.from({ length: PLACEHOLDER_COUNTS.tags }, (_, index) => ({ value: '', empty: true, index }))
})

const backgrounds = computed(() => {
  const list = props.project?.background ?? []
  return list.length
    ? list.map((text) => ({ text, empty: false }))
    : Array.from({ length: PLACEHOLDER_COUNTS.background }, () => ({ text: '', empty: true }))
})

const problems = computed(() =>
  withPlaceholders(props.project?.problems, PLACEHOLDER_COUNTS.problems, (index) => ({
    index,
    title: '',
    symptom: '',
    diagnosis: '',
    approach: '',
    result: '',
  })),
)

const results = computed(() =>
  withPlaceholders(props.project?.results, PLACEHOLDER_COUNTS.results, (index) => ({
    index,
    label: '',
    value: '',
  })),
)

/** 截图区只画真实素材；一条真素材都没有时整段不出现（不留空框） */
const shots = computed(() =>
  (props.project?.shots ?? []).filter((item) => item && item.src),
)

/** 难题的四段小结构；做法单独强调 */
const problemParts = [
  { key: 'symptom', label: '现象' },
  { key: 'diagnosis', label: '定位' },
  { key: 'approach', label: '做法', accent: true },
  { key: 'result', label: '验证' },
]

/** 截图区同时支持图片与视频：按扩展名决定渲染哪一种 */
const VIDEO_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i

function isVideo(src) {
  return typeof src === 'string' && VIDEO_RE.test(src)
}

/** 小程序码：未配置或图片加载失败时整块隐藏，不留破图标 */
const qrBroken = ref(false)

const qr = computed(() => {
  const item = props.project?.qr
  return item && item.src && !qrBroken.value ? item : null
})
</script>

<template>
  <!-- 项目不存在（非法 slug）：给一个可操作的空态，而不是白屏 -->
  <section v-if="!project" class="detail detail--missing" aria-labelledby="missing-title">
    <h2 id="missing-title" class="detail__empty-title">没有找到这个项目</h2>
    <p class="detail__empty-text">链接可能已经失效，或者项目已被移除。</p>
    <RouterLink class="btn-primary detail__empty-link" to="/projects">回到第一个项目</RouterLink>
  </section>

  <article v-else class="detail" aria-labelledby="project-title">
    <!-- =====================================================================
         ① 头部
         ================================================================== -->
    <header class="detail__head">
      <div class="detail__meta-row">
        <span class="detail__meta">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>
          <template v-if="project.period">{{ project.period }}</template>
          <Placeholder v-else label="时间区间" path="period" />
        </span>
        <span class="detail__meta">
          <i class="fa-regular fa-user" aria-hidden="true"></i>
          <template v-if="project.role">{{ project.role }}</template>
          <Placeholder v-else label="我的角色" path="role" />
        </span>

        <!-- 在线体验：只在配置了 demo.url 时出现 -->
        <a
          v-if="project.demo && project.demo.url"
          class="detail__demo"
          :href="project.demo.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          {{ project.demo.label || '在线体验' }}
        </a>
      </div>

      <h1 id="project-title" class="detail__title">
        <template v-if="project.name">{{ project.name }}</template>
        <Placeholder v-else label="项目名称" path="name" />
      </h1>

      <!-- 技术标签 -->
      <ul class="detail__tags">
        <li v-for="(tag, index) in tags" :key="`tag-${index}`">
          <span v-if="!tag.empty" class="detail__tag">{{ tag.value }}</span>
          <Placeholder v-else variant="chip" label="技术标签" path="tags[]" />
        </li>
      </ul>

      <!-- 一句话价值（建议含量化结果） -->
      <p class="detail__value">
        <template v-if="project.value">{{ project.value }}</template>
        <Placeholder v-else label="一句话价值（含量化结果）" path="value" />
      </p>

      <!-- 小程序码：扫码直接进小程序体验 -->
      <div v-if="qr" class="detail__qr">
        <img
          class="detail__qr-img"
          :src="qr.src"
          :alt="qr.label"
          loading="lazy"
          @error="qrBroken = true"
        />
        <div class="detail__qr-text">
          <strong>{{ qr.label }}</strong>
          <span v-if="qr.note">{{ qr.note }}</span>
        </div>
      </div>
    </header>

    <!-- =====================================================================
         ② 背景与目标
         ================================================================== -->
    <section class="detail__block" aria-labelledby="bg-title">
      <h2 id="bg-title" class="detail__h2">背景与目标</h2>
      <div class="detail__prose">
        <template v-for="(item, index) in backgrounds" :key="`bg-${index}`">
          <p v-if="!item.empty">{{ item.text }}</p>
          <div v-else class="detail__prose-empty">
            <Placeholder variant="line" />
            <code v-if="SHOW_HINTS" class="detail__field">background[{{ index }}]</code>
          </div>
        </template>
      </div>
    </section>

    <!-- =====================================================================
         ③ 遇到的难题：编号 + 左侧竖线
         ================================================================== -->
    <section class="detail__block" aria-labelledby="problems-title">
      <h2 id="problems-title" class="detail__h2">遇到的难题</h2>

      <ol class="problems">
        <li
          v-for="(item, index) in problems"
          :key="`problem-${index}`"
          class="problem"
        >
          <!-- 编号列 + 竖线 -->
          <div class="problem__gutter" aria-hidden="true">
            <span class="problem__index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="problem__line"></span>
          </div>

          <div class="problem__body">
            <h3 class="problem__title">
              <template v-if="item.data.title">{{ item.data.title }}</template>
              <Placeholder
                v-else
                label="难题标题"
                :path="`problems[${index}].title`"
              />
            </h3>

            <!-- 现象 → 定位 → 做法 → 验证 -->
            <dl class="problem__parts">
              <div
                v-for="part in problemParts"
                :key="part.key"
                class="problem__part"
                :class="{ 'is-accent': part.accent }"
              >
                <dt class="problem__label">{{ part.label }}</dt>
                <dd class="problem__text">
                  <template v-if="item.data[part.key]">{{ item.data[part.key] }}</template>
                  <Placeholder
                    v-else
                    :label="`${part.label}说明`"
                    :path="`problems[${index}].${part.key}`"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </li>
      </ol>
    </section>

    <!-- =====================================================================
         ④ 结果与数据
         ================================================================== -->
    <section class="detail__block" aria-labelledby="results-title">
      <h2 id="results-title" class="detail__h2">结果与数据</h2>

      <dl class="results">
        <div v-for="(item, index) in results" :key="`result-${index}`" class="result">
          <dd class="result__value">
            <template v-if="item.data.value">{{ item.data.value }}</template>
            <Placeholder
              v-else
              label="数值"
              :path="`results[${index}].value`"
            />
          </dd>
          <dt class="result__label">
            <template v-if="item.data.label">{{ item.data.label }}</template>
            <Placeholder
              v-else
              label="指标名"
              :path="`results[${index}].label`"
            />
            <!-- 数据口径时间：让「在线用户」这类会变的数字有明确截止日 -->
            <span v-if="item.data.note" class="result__note">{{ item.data.note }}</span>
          </dt>
        </div>
      </dl>
    </section>

    <!-- =====================================================================
         ⑤ 截图 / 演示
         ================================================================== -->
    <section v-if="shots.length" class="detail__block" aria-labelledby="shots-title">
      <h2 id="shots-title" class="detail__h2">截图 / 演示</h2>

      <div class="shots">
        <figure v-for="(shot, index) in shots" :key="`shot-${index}`" class="shot">
          <div class="shot__frame" :class="{ 'shot__frame--video': isVideo(shot.src) }">
            <!-- 视频：只预加载元信息，点播放才拉流，避免大文件拖慢首屏 -->
            <video
              v-if="isVideo(shot.src)"
              class="shot__video"
              :src="shot.src"
              :poster="shot.poster || undefined"
              controls
              preload="metadata"
              playsinline
            ></video>
            <img
              v-else
              class="shot__img"
              :src="shot.src"
              :alt="shot.caption || `项目截图 ${index + 1}`"
              loading="lazy"
              decoding="async"
            />
          </div>

          <figcaption v-if="shot.caption" class="shot__caption">{{ shot.caption }}</figcaption>
        </figure>
      </div>
    </section>
  </article>
</template>

<style scoped src="../styles/projectdetail.css"></style>

