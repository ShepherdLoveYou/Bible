<template>
  <Teleport to="body">
    <div v-if="visible" class="fs-overlay" tabindex="-1">
      <!-- Top Bar -->
      <div class="fs-container">
        <div class="fs-topbar">
          <div class="fs-topbar-left">
            <span class="fs-title">📖 {{ bookDisplayName(currentBook) }} {{ chapterLabel(selectedChapter) }}</span>
          </div>
          <div class="fs-topbar-right">
            <button class="fs-icon-btn" :class="{ active: showSearch }" @click="toggleSearch" title="搜索 Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button class="fs-icon-btn" @click="changeFontSize(-1)" title="缩小字体 Smaller">A-</button>
            <button class="fs-icon-btn" @click="changeFontSize(1)" title="放大字体 Larger">A+</button>
            <button class="fs-icon-btn fs-close-btn" @click="$emit('close')" title="退出全屏 Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div v-if="showSearch" class="fs-search-bar">
          <input
            ref="searchInput"
            v-model="searchQuery"
            class="fs-search-input"
            placeholder="搜索经文... Search verses..."
            @input="onSearch"
            @keydown.enter="nextSearchMatch"
            @keydown.escape="toggleSearch"
          />
          <span v-if="searchQuery" class="fs-search-count">
            {{ searchMatchIndex + 1 }}/{{ searchMatches.length }}
          </span>
          <button v-if="searchQuery" class="fs-search-nav-btn" @click="prevSearchMatch" title="上一个">▲</button>
          <button v-if="searchQuery" class="fs-search-nav-btn" @click="nextSearchMatch" title="下一个">▼</button>
          <button class="fs-search-nav-btn" @click="toggleSearch" title="关闭搜索">✕</button>
        </div>

        <!-- Selector Row -->
        <div class="fs-selector-row">
          <select v-model="selectedVersion" class="fs-select" @change="loadChapter">
            <optgroup v-for="group in versionGroups" :key="group.label" :label="group.label">
              <option v-for="v in group.versions" :key="v.id" :value="v.id">{{ v.name }}</option>
            </optgroup>
          </select>
          <select v-model="selectedBookIndex" class="fs-select fs-book-select" @change="onBookChange">
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
          <select v-model="selectedChapter" class="fs-select fs-chapter-select" @change="loadChapter">
            <option v-for="ch in chapterCount" :key="ch" :value="ch">{{ chapterLabel(ch) }}</option>
          </select>
        </div>

        <!-- Reading Area -->
        <div class="fs-reading-area" ref="fsTextContainer">
          <div v-if="loading" class="fs-loading">
            <div class="loading-spinner"></div>
            <span>加载中 Loading...</span>
          </div>
          <div v-else-if="error" class="fs-error">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="loadChapter">重试 Retry</button>
          </div>
          <div v-else class="fs-text" :style="{ fontSize: fsFontSize + 'px' }">
            <div
              v-for="(verse, idx) in verses"
              :key="verse.verse"
              class="fs-verse"
              :class="{ 'fs-verse-highlight': isSearchHighlight(idx) }"
              :ref="el => { if (isSearchHighlight(idx)) activeMatchEl = el }"
            >
              <sup class="fs-verse-num">{{ verse.verse }}</sup>
              <span class="fs-verse-text" v-html="highlightText(verse.text)"></span>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="fs-bottombar">
          <button class="fs-nav-btn" :disabled="!hasPrev" @click="prevChapter" title="上一章 Previous Chapter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            上一章
          </button>
          <div class="fs-page-controls">
            <button class="fs-page-btn" @click="pageUp" title="上一页 Page Up">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <span class="fs-page-label">{{ bookDisplayName(currentBook) }} {{ selectedChapter }}</span>
            <button class="fs-page-btn" @click="pageDown" title="下一页 Page Down">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
          <button class="fs-nav-btn" :disabled="!hasNext" @click="nextChapter" title="下一章 Next Chapter">
            下一章
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useBibleSearch } from '../composables/useBibleSearch'

const props = defineProps({
  visible: Boolean,
  // Shared reader state (passed from parent)
  selectedVersion: String,
  selectedBookIndex: Number,
  selectedChapter: Number,
  verses: Array,
  loading: Boolean,
  error: String,
  currentBook: Object,
  chapterCount: Number,
  hasPrev: Boolean,
  hasNext: Boolean,
  isChinese: Boolean,
  otLabel: String,
  ntLabel: String,
  otBooks: Array,
  ntBooks: Array,
  versionGroups: Array,
  bookDisplayName: Function,
  chapterLabel: Function,
  // Navigation methods
  onBookChange: Function,
  prevChapter: Function,
  nextChapter: Function,
  loadChapter: Function,
})

const emit = defineEmits(['close', 'update:selectedVersion', 'update:selectedBookIndex', 'update:selectedChapter'])

// Two-way binding proxies
const selectedVersion = ref(props.selectedVersion)
const selectedBookIndex = ref(props.selectedBookIndex)
const selectedChapter = ref(props.selectedChapter)

watch(() => props.selectedVersion, v => { selectedVersion.value = v })
watch(() => props.selectedBookIndex, v => { selectedBookIndex.value = v })
watch(() => props.selectedChapter, v => { selectedChapter.value = v })
watch(selectedVersion, v => emit('update:selectedVersion', v))
watch(selectedBookIndex, v => emit('update:selectedBookIndex', v))
watch(selectedChapter, v => emit('update:selectedChapter', v))

// Search — pass a computed ref so useBibleSearch always sees latest verses
const versesRef = computed(() => props.verses || [])
const {
  showSearch, searchQuery, searchMatches, searchMatchIndex,
  searchInput, activeMatchEl,
  toggleSearch, onSearch, nextSearchMatch, prevSearchMatch,
  isSearchHighlight, highlightText,
} = useBibleSearch(versesRef)

// Re-run search when verses change (e.g. chapter/version switch)
watch(versesRef, () => {
  if (searchQuery.value) onSearch()
})

// Font size
const fsFontSize = ref(18)
function changeFontSize(delta) {
  fsFontSize.value = Math.max(12, Math.min(32, fsFontSize.value + delta * 2))
}

// Page scroll
const fsTextContainer = ref(null)
function pageUp() {
  fsTextContainer.value?.scrollBy({ top: -fsTextContainer.value.clientHeight * 0.85, behavior: 'smooth' })
}
function pageDown() {
  fsTextContainer.value?.scrollBy({ top: fsTextContainer.value.clientHeight * 0.85, behavior: 'smooth' })
}

// Keyboard
function onKeydown(e) {
  if (!props.visible) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft' && props.hasPrev) props.prevChapter()
  if (e.key === 'ArrowRight' && props.hasNext) props.nextChapter()
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault()
    if (!showSearch.value) toggleSearch()
    else searchInput.value?.focus()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  animation: fs-fadein 0.25s ease;
}

@keyframes fs-fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fs-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

/* Top Bar */
.fs-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.fs-topbar-left {
  flex: 1;
  min-width: 0;
}

.fs-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fs-topbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.fs-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 8px;
}

.fs-icon-btn:hover, .fs-icon-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.fs-close-btn:hover {
  background: #e53e3e;
  border-color: #e53e3e;
}

/* Search Bar */
.fs-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  flex-shrink: 0;
}

.fs-search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.fs-search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.fs-search-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 36px;
  text-align: center;
}

.fs-search-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.fs-search-nav-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* Selector Row */
.fs-selector-row {
  display: flex;
  gap: 8px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.fs-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.fs-select:focus {
  border-color: var(--vp-c-brand-1);
}

.fs-book-select {
  flex: 2;
}

.fs-chapter-select {
  min-width: 100px;
}

/* Reading Area */
.fs-reading-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  scroll-behavior: smooth;
}

.fs-reading-area::-webkit-scrollbar {
  width: 8px;
}

.fs-reading-area::-webkit-scrollbar-track {
  background: transparent;
}

.fs-reading-area::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.fs-reading-area::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.fs-text {
  max-width: 680px;
  margin: 0 auto;
  line-height: 2;
}

.fs-verse {
  margin-bottom: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.fs-verse:hover {
  background: var(--vp-c-bg-soft);
}

.fs-verse-highlight {
  background: rgba(0, 122, 255, 0.1) !important;
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 12px;
}

.fs-verse-num {
  color: var(--vp-c-brand-1);
  font-size: 0.7em;
  font-weight: 700;
  margin-right: 6px;
  vertical-align: super;
  opacity: 0.8;
}

.fs-verse-text {
  color: var(--vp-c-text-1);
}

:deep(.fs-search-mark) {
  background: rgba(255, 200, 0, 0.4);
  color: inherit;
  padding: 1px 2px;
  border-radius: 2px;
}

.dark :deep(.fs-search-mark) {
  background: rgba(255, 200, 0, 0.3);
}

/* Loading & Error */
.fs-loading, .fs-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.fs-error p {
  margin: 0 0 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  padding: 6px 16px;
  border-radius: 8px;
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

/* Bottom Bar */
.fs-bottombar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  gap: 8px;
}

.fs-nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.fs-nav-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.fs-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fs-page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fs-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.fs-page-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.fs-page-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .fs-topbar {
    padding: 10px 14px;
  }
  .fs-title {
    font-size: 14px;
  }
  .fs-selector-row {
    flex-direction: column;
    padding: 8px 14px;
    gap: 6px;
  }
  .fs-reading-area {
    padding: 16px 14px;
  }
  .fs-text {
    line-height: 1.9;
  }
  .fs-bottombar {
    padding: 8px 10px;
  }
  .fs-nav-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
  .fs-page-controls {
    gap: 8px;
  }
  .fs-page-label {
    display: none;
  }
  .fs-search-bar {
    padding: 8px 14px;
  }
}
</style>
