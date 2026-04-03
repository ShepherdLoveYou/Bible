<script lang="ts" setup>
import Giscus from "@giscus/vue";
import DefaultTheme from "vitepress/theme";
import { watch, onMounted, onUnmounted } from "vue";
import { inBrowser, useData } from "vitepress";
import { useViewTransition } from "./composables/useViewTransition";

const { isDark } = useViewTransition();
const { page } = useData();
const { Layout } = DefaultTheme;

// Smooth scroll to BibleReader when clicking #bible-reader links
function scrollToBibleReader(e: Event) {
  const link = (e.target as HTMLElement).closest('a[href*="#bible-reader"]')
  if (!link) return
  e.preventDefault()
  const el = document.querySelector('.bible-reader')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  if (inBrowser) {
    document.addEventListener('click', scrollToBibleReader)
  }
})

onUnmounted(() => {
  if (inBrowser) {
    document.removeEventListener('click', scrollToBibleReader)
  }
})

// Sync Giscus theme with dark mode
watch(isDark, (dark) => {
  if (!inBrowser) return;
  const iframe = document
    .querySelector("giscus-widget")
    ?.shadowRoot?.querySelector("iframe");
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? "dark" : "light" } } },
    "https://giscus.app"
  );
});
</script>

<template>
  <AppleBackground />
  <AppleNavEnhancement />
  <AppleFloatingActionButton />   
  <Layout>
    <template #home-hero-image>
      <div class="hero-bible-reader">
        <BibleReader />
      </div>
    </template>
    <template #home-features-before>
      <div class="mobile-hero-bible-reader">
        <BibleReader />
      </div>
    </template>
    <template #doc-footer-before> </template>
    <template #doc-after>
      <div style="margin-top: 24px">
        <Giscus
          :key="page.filePath"
          repo="wxfengg/xfeng-blog"
          repo-id="R_kgDOOx6hRQ"
          category="Announcements"
          category-id="DIC_kwDOOx6hRc4Cqtwl"
          mapping="pathname"
          strict="0"
          reactions-enabled="1"
          emit-metadata="0"
          input-position="top"
          data-theme="preferred_color_scheme"
          lang="zh-CN"
          data-loading="lazy"
          crossorigin="anonymous"
          :theme="isDark ? 'dark' : 'light'"
          loading="lazy"
        />
      </div>
    </template>
  </Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

/* 切换主题样式 */
/* .VPSwitchAppearance {
  width: 22px !important;
} */

/* .VPSwitchAppearance .check {
  transform: none !important;
} */

.hero-bible-reader {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .hero-bible-reader {
    display: none;
  }
}

.mobile-hero-bible-reader {
  display: none;
  margin-top: 24px;
}

@media (max-width: 960px) {
  .mobile-hero-bible-reader {
    display: block;
  }
}
</style>