---
layout: home

hero:
  name: "福音的光"
  text: "Gospel Light"
  tagline: 將希望和真理帶到每一個角落  Bringing hope and truth to every corner
  image:
    src: /cross.svg
    alt: Gospel Light
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

<div class="home-grid">
  <div class="home-left">
    <AppleCard title="关于本站" subtitle="福音的光 Gospel Light" icon="✝️">
      本站致力于分享圣经真理、节期知识和信仰资源。愿神的话语成为你脚前的灯、路上的光。
    </AppleCard>
    <AppleCard>
      <VisitorPanel />
    </AppleCard>
  </div>
  <div class="home-right">
    <BibleReader />
  </div>
</div>

<style>
.home-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}
.home-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.home-right {
  min-width: 0;
}
@media (max-width: 768px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
