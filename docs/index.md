---
layout: home

hero:
  name: "福音的光"
  text: "Gospel Light"
  tagline: 將希望和真理帶到每一個角落  Bringing hope and truth to every corner
  actions:
    - theme: brand
      text: 阅读最新文章
      link: /blogs/latest
    - theme: alt
      text: 关于本站
      link: /about

features:
  - title: 圣经阅读
    icon: 📖
    details: 圣经阅读资源与下载，帮助你更深入地认识神的话语。
    link: /blogs/bible-reading
    linkText: 查看详情
  - title: 节期学习
    icon: 🕎
    details: 耶和华的节期、逾越节、五旬节等圣经节期的深入探讨。
    link: /blogs/feasts-of-the-lord
    linkText: 查看详情
  - title: 信仰资源
    icon: ✝️
    details: 电子书、主日学材料等丰富的属灵资源分享。
    link: /blogs/resource-share
    linkText: 查看详情
---

<div class="mobile-bible-reader">
  <BibleReader />
</div>

<div style="margin-top: 24px;">
  <AppleCard title="关于本站" subtitle="福音的光 Gospel Light" icon="✝️">
    本站致力于分享圣经真理、节期知识和信仰资源。愿神的话语成为你脚前的灯、路上的光。
  </AppleCard>
</div>

<AppleCard>
  <VisitorPanel />
</AppleCard>

<style>
.mobile-bible-reader {
  display: none;
  margin-top: 24px;
}
@media (max-width: 960px) {
  .mobile-bible-reader {
    display: block;
  }
}
</style>
