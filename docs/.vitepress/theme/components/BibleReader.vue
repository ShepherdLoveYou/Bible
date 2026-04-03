<template>
  <div class="bible-reader">
    <div class="bible-reader-bg"></div>
    <div class="bible-reader-content">
      <!-- Header -->
      <div class="bible-reader-header">
        <span class="bible-reader-icon">📖</span>
        <h3 class="bible-reader-title">圣经阅读 Bible Reader</h3>
      </div>

      <!-- Version Selector -->
      <div class="bible-nav">
        <div class="bible-nav-field">
          <label class="bible-label">语言与版本 Language & Version</label>
          <select v-model="selectedVersion" class="bible-select version-select" @change="loadChapter">
            <optgroup label="中文 Chinese">
              <option v-for="v in chineseVersions" :key="v.id" :value="v.id">{{ v.name }}</option>
            </optgroup>
            <optgroup label="英文 English">
              <option v-for="v in englishVersions" :key="v.id" :value="v.id">{{ v.name }}</option>
            </optgroup>
          </select>
        </div>

        <!-- Book & Chapter -->
        <div class="bible-nav-field">
          <label class="bible-label">书卷与章节 Book & Chapter</label>
          <div class="bible-nav-row">
            <select v-model="selectedBookIndex" class="bible-select book-select" @change="onBookChange">
              <optgroup label="旧约 Old Testament">
                <option v-for="(book, i) in otBooks" :key="book.osis" :value="i">
                  {{ book.name.zh }} {{ book.name.en }}
                </option>
              </optgroup>
              <optgroup label="新约 New Testament">
                <option v-for="(book, i) in ntBooks" :key="book.osis" :value="i + otBooks.length">
                  {{ book.name.zh }} {{ book.name.en }}
                </option>
              </optgroup>
            </select>
            <select v-model="selectedChapter" class="bible-select chapter-select" @change="loadChapter">
              <option v-for="ch in chapterCount" :key="ch" :value="ch">
                第 {{ ch }} 章 Ch.{{ ch }}
              </option>
            </select>
          </div>
        </div>
        <div class="bible-nav-actions">
          <button class="nav-btn" :disabled="!hasPrev" @click="prevChapter" title="上一章 Previous">‹</button>
          <span class="chapter-label">{{ currentBook?.name.zh }} {{ currentBook?.name.en }} {{ selectedChapter }}</span>
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
          <button class="retry-btn" @click="loadChapter">重试 Retry</button>
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
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { OT_BOOKS, NT_BOOKS, ALL_BOOKS } from './bible-data'

const otBooks = OT_BOOKS
const ntBooks = NT_BOOKS

const chineseVersions = [
  { id: 'CUNPS', name: '新标点和合本(简体)' },
  { id: 'CUV', name: '和合本(繁體)' },
  { id: 'ChiSB', name: '思高圣经' },
]

const englishVersions = [
  { id: 'KJV', name: 'KJV' },
  { id: 'ESV', name: 'ESV' },
  { id: 'NIV', name: 'NIV (1984)' },
  { id: 'NKJV', name: 'NKJV' },
  { id: 'NLT', name: 'NLT' },
  { id: 'NASB', name: 'NASB' },
  { id: 'WEB', name: 'WEB' },
]

const selectedVersion = ref('CUNPS')
const selectedBookIndex = ref(42) // John
const selectedChapter = ref(1)
const verses = ref([])
const loading = ref(false)
const error = ref('')
const textContainer = ref(null)

const currentBook = computed(() => ALL_BOOKS[selectedBookIndex.value])
const chapterCount = computed(() => currentBook.value?.chapters || 1)
const hasPrev = computed(() => !(selectedBookIndex.value === 0 && selectedChapter.value === 1))
const hasNext = computed(() => !(selectedBookIndex.value === ALL_BOOKS.length - 1 && selectedChapter.value === chapterCount.value))

function stripHtml(html) {
  // Remove Strong's numbers <S>...</S> and footnotes <sup>...</sup> with their content
  const cleaned = html.replace(/<S>\d+<\/S>/gi, '').replace(/<sup>[^<]*<\/sup>/gi, '')
  const tmp = document.createElement('div')
  tmp.innerHTML = cleaned
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ')
}

function onBookChange() {
  selectedChapter.value = 1
  loadChapter()
}

function prevChapter() {
  if (selectedChapter.value > 1) {
    selectedChapter.value--
  } else if (selectedBookIndex.value > 0) {
    selectedBookIndex.value--
    selectedChapter.value = ALL_BOOKS[selectedBookIndex.value].chapters
  }
  loadChapter()
}

function nextChapter() {
  if (selectedChapter.value < chapterCount.value) {
    selectedChapter.value++
  } else if (selectedBookIndex.value < ALL_BOOKS.length - 1) {
    selectedBookIndex.value++
    selectedChapter.value = 1
  }
  loadChapter()
}

async function loadChapter() {
  const book = currentBook.value
  if (!book) return

  // bolls.life uses 1-based book IDs: Gen=1 ... Rev=66
  const bookId = selectedBookIndex.value + 1
  loading.value = true
  error.value = ''
  verses.value = []

  try {
    const resp = await fetch(`https://bolls.life/get-text/${selectedVersion.value}/${bookId}/${selectedChapter.value}/`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json()
    if (Array.isArray(data) && data.length > 0) {
      verses.value = data.map(v => ({
        verse: v.verse,
        text: stripHtml(v.text).trim()
      }))
    } else {
      throw new Error('无法获取经文内容')
    }
  } catch (e) {
    error.value = '加载失败，请稍后重试 Failed to load, please try again'
  } finally {
    loading.value = false
    await nextTick()
    if (textContainer.value) {
      textContainer.value.scrollTop = 0
    }
  }
}

onMounted(() => {
  loadChapter()
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
  max-height: 420px;
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
    max-height: 320px;
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
