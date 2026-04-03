<template>
  <div class="bible-reader">
    <div class="bible-reader-bg"></div>
    <div class="bible-reader-content">
      <!-- Header -->
      <div class="bible-reader-header">
        <span class="bible-reader-icon">📖</span>
        <h3 class="bible-reader-title">圣经阅读 Bible Reader</h3>
        <button class="fullscreen-btn" @click="openFullscreen" title="全屏阅读 Fullscreen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
      </div>

      <!-- Version Selector -->
      <div class="bible-nav">
        <div class="bible-nav-field">
          <label class="bible-label">语言与版本 Language & Version</label>
          <select v-model="selectedVersion" class="bible-select version-select" @change="() => loadChapter(textContainer)">
            <optgroup v-for="group in versionGroups" :key="group.label" :label="group.label">
              <option v-for="v in group.versions" :key="v.id" :value="v.id">{{ v.name }}</option>
            </optgroup>
          </select>
        </div>

        <!-- Book & Chapter -->
        <div class="bible-nav-field">
          <label class="bible-label">书卷与章节 Book & Chapter</label>
          <div class="bible-nav-row">
            <select v-model="selectedBookIndex" class="bible-select book-select" @change="onBookChange">
              <optgroup :label="otLabel">
                <option v-for="(book, i) in otBooks" :key="book.osis" :value="i">
                  {{ bookDisplayName(book) }}
                </option>
              </optgroup>
              <optgroup :label="ntLabel">
                <option v-for="(book, i) in ntBooks" :key="book.osis" :value="i + otBooks.length">
                  {{ bookDisplayName(book) }}
                </option>
              </optgroup>
            </select>
            <select v-model="selectedChapter" class="bible-select chapter-select" @change="() => loadChapter(textContainer)">
              <option v-for="ch in chapterCount" :key="ch" :value="ch">
                {{ chapterLabel(ch) }}
              </option>
            </select>
          </div>
        </div>
        <div class="bible-nav-actions">
          <button class="nav-btn" :disabled="!hasPrev" @click="prevChapter" title="上一章 Previous">‹</button>
          <span class="chapter-label">{{ bookDisplayName(currentBook) }} {{ selectedChapter }}</span>
          <button class="nav-btn" :disabled="!hasNext" @click="nextChapter" title="下一章 Next">›</button>
        </div>
      </div>

      <!-- Content -->
      <div class="bible-text-container" ref="textContainer">
        <div v-if="loading" class="bible-loading">
          <div class="loading-spinner"></div>
          <span>加载中 Loading...</span>
        </div>
        <div v-else-if="error" class="bible-error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="() => loadChapter(textContainer)">重试 Retry</button>
        </div>
        <div v-else class="bible-text">
          <div v-for="verse in verses" :key="verse.verse" class="bible-verse">
            <sup class="verse-num">{{ verse.verse }}</sup>
            <span class="verse-text">{{ verse.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Fullscreen mode (separate component) -->
  <BibleFullscreen
    :visible="isFullscreen"
    :selected-version="selectedVersion"
    :selected-book-index="selectedBookIndex"
    :selected-chapter="selectedChapter"
    :verses="verses"
    :loading="loading"
    :error="error"
    :current-book="currentBook"
    :chapter-count="chapterCount"
    :has-prev="hasPrev"
    :has-next="hasNext"
    :is-chinese="isChinese"
    :ot-label="otLabel"
    :nt-label="ntLabel"
    :ot-books="otBooks"
    :nt-books="ntBooks"
    :version-groups="versionGroups"
    :book-display-name="bookDisplayName"
    :chapter-label="chapterLabel"
    :on-book-change="onBookChange"
    :prev-chapter="prevChapter"
    :next-chapter="nextChapter"
    :load-chapter="() => loadChapter(textContainer)"
    @close="closeFullscreen"
    @update:selected-version="v => { selectedVersion = v; loadChapter(textContainer) }"
    @update:selected-book-index="v => { selectedBookIndex = v }"
    @update:selected-chapter="v => { selectedChapter = v; loadChapter(textContainer) }"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBibleReader } from '../composables/useBibleReader'

const {
  otBooks, ntBooks, versionGroups,
  selectedVersion, selectedBookIndex, selectedChapter,
  verses, loading, error,
  currentBook, chapterCount, hasPrev, hasNext,
  isChinese, otLabel, ntLabel,
  bookDisplayName, chapterLabel,
  onBookChange, prevChapter, nextChapter, loadChapter,
} = useBibleReader()

const textContainer = ref(null)
const isFullscreen = ref(false)

function openFullscreen() {
  isFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

function closeFullscreen() {
  isFullscreen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  loadChapter(textContainer)
})
</script>

<style scoped>
.bible-reader {
  position: relative;
  border-radius: var(--vp-radius-large);
  overflow: hidden;
  border: 1px solid var(--vp-glass-border);
  box-shadow: var(--vp-shadow-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bible-reader:hover {
  box-shadow: var(--vp-shadow-3);
}

.bible-reader-bg {
  position: absolute;
  inset: 0;
  background: var(--vp-glass-bg);
  backdrop-filter: var(--vp-glass-backdrop);
  -webkit-backdrop-filter: var(--vp-glass-backdrop);
}

.bible-reader-content {
  position: relative;
  z-index: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* Header */
.bible-reader-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.bible-reader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--vp-radius-medium);
  background: var(--vp-c-surface-1);
  font-size: 22px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bible-reader:hover .bible-reader-icon {
  transform: scale(1.1);
  background: var(--vp-c-brand-1);
}

.bible-reader-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.025em;
  flex: 1;
}

.fullscreen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-glass-border);
  border-radius: var(--vp-radius-small);
  background: var(--vp-c-surface-1);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.fullscreen-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

/* Navigation */
.bible-nav {
  margin-bottom: 16px;
}

.bible-nav-field {
  margin-bottom: 10px;
}

.bible-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.bible-nav-row {
  display: flex;
  gap: 8px;
}

.bible-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--vp-radius-small);
  border: 1px solid var(--vp-glass-border);
  background: var(--vp-c-surface-1);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.bible-select:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.book-select {
  flex: 2;
}

.version-select {
  width: 100%;
}

.chapter-select {
  flex: 1;
  min-width: 100px;
}

.bible-nav-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-glass-border);
  border-radius: var(--vp-radius-small);
  background: var(--vp-c-surface-1);
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
}

.nav-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chapter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 120px;
  text-align: center;
}

/* Content Area */
.bible-text-container {
  max-height: 520px;
  overflow-y: auto;
  border-radius: var(--vp-radius-small);
  background: var(--vp-c-surface-1);
  padding: 16px;
  scroll-behavior: smooth;
}

.bible-text-container::-webkit-scrollbar {
  width: 6px;
}

.bible-text-container::-webkit-scrollbar-track {
  background: transparent;
}

.bible-text-container::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 3px;
}

.bible-text-container::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* Verse */
.bible-verse {
  margin-bottom: 8px;
  line-height: 1.8;
}

.verse-num {
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  margin-right: 4px;
  vertical-align: super;
  opacity: 0.8;
}

.verse-text {
  font-size: 15px;
  color: var(--vp-c-text-1);
  font-weight: 400;
}

/* Loading */
.bible-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--vp-glass-border);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.bible-error {
  text-align: center;
  padding: 32px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.bible-error p {
  margin: 0 0 12px;
}

.retry-btn {
  padding: 6px 16px;
  border-radius: var(--vp-radius-small);
  border: 1px solid var(--vp-c-brand-1);
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

/* Dark mode */
.dark .bible-reader-icon {
  background: var(--vp-c-surface-2);
}

.dark .bible-reader:hover .bible-reader-icon {
  background: var(--vp-c-brand-1);
}

/* Responsive */
@media (max-width: 768px) {
  .bible-reader-content {
    padding: 16px;
  }

  .bible-reader-header {
    margin-bottom: 12px;
  }

  .bible-reader-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .bible-reader-title {
    font-size: 18px;
  }

  .bible-text-container {
    max-height: 400px;
    padding: 12px;
  }

  .verse-text {
    font-size: 14px;
  }

  .bible-nav-row {
    flex-direction: column;
  }

  .book-select, .chapter-select {
    flex: 1;
  }
}
</style>
