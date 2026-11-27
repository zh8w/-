<script setup>
/**
 * =============================================================================
 * SiteFooter —— 页脚
 *
 * 首页：联系方式（邮箱 / 电话 / GitHub）+ 版权，压成简洁一行。
 * 其他页：只保留版权。
 *
 * 三条约定：
 * 1) 电话直接展示号码（tel: 可拨号），不再折叠成「点击查看」。
 * 2) 简历下载入口全站只保留 2 处（顶部导航 + Banner 主按钮），
 *    所以这里不再出现「简历下载」。
 * 3) 没填的字段直接不渲染，不留虚线占位——页脚是收尾，不是待办清单。
 * ========================================================================== */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { contact, footer } from '../data/site'

const route = useRoute()

// 只有首页展示联系方式条
const showContact = computed(() => route.name === 'home')

const currentYear = new Date().getFullYear()

// 是否有任何一项联系方式可显示
const hasContact = computed(() =>
  Boolean(contact.email || contact.phone || contact.github),
)

// GitHub 显示文字：填了用填的，否则用链接本身
const githubText = computed(() => contact.githubLabel || contact.github)

// tel: 链接里去掉空格与连字符，显示时保留原样
const phoneHref = computed(() => `tel:${(contact.phone || '').replace(/[\s-]/g, '')}`)
</script>

<template>
  <footer class="footer">
    <div class="page-shell footer__row">
      <!-- 联系方式：只在首页显示 -->
      <div v-if="showContact && hasContact" class="footer__contact">
        <!-- 邮箱：永远可点 -->
        <a v-if="contact.email" class="footer__item" :href="`mailto:${contact.email}`">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i>
          <span>{{ contact.email }}</span>
        </a>

        <!-- 电话：直接展示号码，点击即可拨号 -->
        <a v-if="contact.phone" class="footer__item" :href="phoneHref">
          <i class="fa-solid fa-phone" aria-hidden="true"></i>
          <span>{{ contact.phone }}</span>
        </a>

        <!-- GitHub：填了才出现 -->
        <a
          v-if="contact.github"
          class="footer__item"
          :href="contact.github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-brands fa-github" aria-hidden="true"></i>
          <span>{{ githubText }}</span>
        </a>
      </div>

      <!-- 版权 -->
      <p class="footer__copy">© {{ currentYear }} {{ footer.copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  border-top: 1px solid var(--line-soft);
  background: color-mix(in oklab, var(--bg-deep) 55%, transparent);
}

/* 一行排布：联系方式在左，版权在右 */
.footer__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem 1.5rem;
  padding-block: 1rem;
}

.footer__contact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1.1rem;
  min-width: 0;
}

.footer__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.24s var(--ease-out-soft);
}

.footer__item i {
  font-size: 0.7rem;
  color: var(--text-faint);
  transition: color 0.24s var(--ease-out-soft);
}

@media (hover: hover) and (pointer: fine) {
  .footer__item:hover {
    color: var(--accent);
  }

  .footer__item:hover i {
    color: var(--accent);
  }
}

.footer__item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

.footer__copy {
  margin: 0;
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-faint);
  white-space: nowrap;
}

/* 窄屏：纵向排，避免横向溢出 */
@media (max-width: 560px) {
  .footer__row {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer__copy {
    margin-left: 0;
  }
}
</style>
