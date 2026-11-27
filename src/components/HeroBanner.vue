<script setup>
/**
 * =============================================================================
 * HeroBanner —— 首页首屏
 *
 * 布局（≥1024px）：左文字栏（max 720px） + 右栏（300–340px），gap 48px
 * 布局（<1024px）：右栏整块下移，排在文字之后，宽度 100%
 *
 * 右栏自上而下：证件照卡（4:5）+ 作品索引卡
 * 左栏自上而下：状态徽标 / 姓名 / 岗位方向 / 简介 / 指标条 / 按钮 / 技能摘要
 *
 * 两个关键约定：
 * 1) 证件照「有图 / 无图」共用同一个 .hero__photo 容器（尺寸、圆角、描边完全一致），
 *    只切换内部内容。填 hero.photo 即显示照片，不改任何布局。
 * 2) 所有文案、图片、链接都来自 src/data/site.js 与 src/data/projects.js，
 *    组件内不写死任何个人内容。
 * ========================================================================== */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { hero, resume } from '../data/site'
import { projects } from '../data/projects'

const route = useRoute()

// 下载文件名（没填就让浏览器按 URL 决定，避免存成 resume(1).pdf）
const downloadName = computed(() => resume.downloadName || undefined)

// 姓名拼音转大写，模板里不做字符串处理
const pinyin = computed(() => (hero.namePinyin || '').toUpperCase())

// 证件照：有地址就显示照片，没地址显示设计过的空态卡
const hasPhoto = computed(() => Boolean(hero.photo))

// 个人信息：value 为空的行直接剔除，不留空行
const profileRows = computed(() =>
  (hero.profile ?? []).filter((row) => row && row.value && String(row.value).trim()),
)

// 当前所在项目（用于首屏索引卡的「选中」态；在首页时通常没有）
const activeSlug = computed(() => route.params.slug)

/**
 * 作品索引条目：短名 / 时间 / 一行结果。
 * 结果优先取项目里的 highlight（一句短语），没有则退回 value。
 * 两者都来自 data，不在模板里拼死文案。
 */
const indexItems = computed(() =>
  projects.map((project) => ({
    slug: project.slug,
    shortName: project.shortName,
    period: project.period,
    note: project.highlight || project.value,
  })),
)
</script>

<template>
  <section class="hero" aria-labelledby="hero-name">
    <div class="hero__layout">
      <!-- =================================================================
           左：文字主区
           ================================================================== -->
      <div class="hero__main">
        <!-- ① 状态徽标 -->
        <p class="hero__status">{{ hero.status }}</p>

        <!-- ② 姓名：中文大字 + 拼音小字（同一行基线） -->
        <h1 id="hero-name" class="hero__name">
          <span class="hero__name-zh">{{ hero.nameZh }}</span>
          <span v-if="pinyin" class="hero__name-pinyin">{{ pinyin }}</span>
        </h1>

        <!-- ③ 岗位方向：主方向加粗，副方向弱化 -->
        <p class="hero__role">
          <strong class="hero__role-primary">{{ hero.rolePrimary }}</strong>
          <span class="hero__role-secondary">{{ hero.roleSecondary }}</span>
        </p>

        <!-- ④ 简介：留空则整块不渲染（避免留下空当） -->
        <div v-if="hero.intro && hero.intro.length" class="hero__intro">
          <p v-for="(line, index) in hero.intro" :key="`intro-${index}`">{{ line }}</p>
        </div>

        <!-- ⑤ 个人信息：2 列网格，无卡片底色，仅行间分隔线 -->
        <dl v-if="profileRows.length" class="hero__profile">
          <div
            v-for="row in profileRows"
            :key="row.label"
            class="hero__profile-row"
            :class="{ 'is-wide': row.wide }"
          >
            <dt class="hero__profile-label">
              <i class="hero__profile-icon" :class="row.icon" aria-hidden="true"></i>
              <span class="hero__profile-label-text">{{ row.label }}</span>
            </dt>
            <dd class="hero__profile-value">
              <template v-if="row.links && row.links.length">
                <a
                  v-for="link in row.links"
                  :key="link.text"
                  class="hero__profile-link"
                  :href="link.href"
                >
                  <i v-if="link.icon" :class="link.icon" aria-hidden="true"></i>
                  <span>{{ link.text }}</span>
                </a>
              </template>
              <template v-else>{{ row.value }}</template>
            </dd>
          </div>
        </dl>

        <!-- ⑥ 两个入口：主按钮实底，次按钮描边 -->
        <div class="hero__actions">
          <RouterLink class="btn-primary" :to="hero.actions.primary.to">
            <span>{{ hero.actions.primary.label }}</span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>

          <a class="btn-ghost" :href="resume.downloadHref" :download="downloadName">
            <i class="fa-solid fa-download" aria-hidden="true"></i>
            <span>{{ hero.actions.secondary.label }}</span>
          </a>
        </div>

        <!-- ⑦ 技能摘要：label 定宽右对齐 + 逗号分隔的等宽小字 -->
        <dl class="hero__skills">
          <div v-for="group in hero.skills" :key="group.label" class="hero__skill">
            <dt class="hero__skill-label">{{ group.label }}</dt>
            <dd class="hero__skill-value">{{ group.value }}</dd>
          </div>
        </dl>
      </div>

      <!-- =================================================================
           右：证件照卡 + 作品索引卡
           窄屏时整块下移（CSS 控制），不用改 DOM 顺序
           ================================================================== -->
      <aside class="hero__side">
        <!-- 证件照卡：有图/无图共用同一容器 -->
        <div class="hero__photo">
          <img
            v-if="hasPhoto"
            class="hero__photo-img"
            :src="hero.photo"
            :alt="hero.nameZh"
            loading="eager"
            decoding="async"
          />

          <!-- 无图空态：渐变色块 + 首字 + 底部三行信息 -->
          <div v-else class="hero__photo-empty">
            <span class="hero__photo-initial" aria-hidden="true">
              {{ hero.photoFallbackInitial }}
            </span>

            <ul class="hero__photo-meta">
              <li v-for="item in hero.photoMeta" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>

        <!-- 作品索引卡 -->
        <nav class="index-card" aria-label="作品索引">
          <p class="index-card__title">作品索引</p>

          <ul class="index-card__list">
            <li v-for="item in indexItems" :key="item.slug">
              <RouterLink
                class="index-item"
                :class="{ 'is-active': activeSlug === item.slug }"
                :to="{ name: 'project', params: { slug: item.slug } }"
              >
                <span class="index-item__head">
                  <span class="index-item__name">{{ item.shortName }}</span>
                  <span class="index-item__period">{{ item.period }}</span>
                </span>
                <span class="index-item__note">{{ item.note }}</span>
              </RouterLink>
            </li>
          </ul>

          <RouterLink class="index-card__more" to="/projects">
            <span>查看全部 {{ indexItems.length }} 个项目</span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </nav>
      </aside>
    </div>
  </section>
</template>

<style scoped src="../styles/herobanner.css"></style>
