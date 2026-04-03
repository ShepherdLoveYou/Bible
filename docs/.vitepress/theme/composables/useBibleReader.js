import { ref, computed, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { ALL_BOOKS, OT_BOOKS, NT_BOOKS, VERSION_GROUPS, CHINESE_VERSION_IDS } from '../components/bible-data'

/**
 * 圣经阅读器核心逻辑
 * 使用本地 JSON 数据（来自 thiagobodruk/bible），按书卷懒加载并缓存
 */
export function useBibleReader() {
  const selectedVersion = ref('zh_cuv')
  const selectedBookIndex = ref(42) // 约翰福音 John
  const selectedChapter = ref(1)
  const verses = ref([])
  const loading = ref(false)
  const error = ref('')

  // Per-book cache: "zh_cuv-43" → [[ch1_verses], [ch2_verses], ...]
  const bookCache = new Map()

  const currentBook = computed(() => ALL_BOOKS[selectedBookIndex.value])
  const chapterCount = computed(() => currentBook.value?.chapters || 1)
  const hasPrev = computed(() => !(selectedBookIndex.value === 0 && selectedChapter.value === 1))
  const hasNext = computed(() => !(selectedBookIndex.value === ALL_BOOKS.length - 1 && selectedChapter.value === chapterCount.value))

  const isChinese = computed(() => CHINESE_VERSION_IDS.has(selectedVersion.value))
  const otLabel = computed(() => isChinese.value ? '旧约' : 'Old Testament')
  const ntLabel = computed(() => isChinese.value ? '新约' : 'New Testament')

  function bookDisplayName(book) {
    if (!book) return ''
    return isChinese.value ? book.name.zh : book.name.en
  }

  function chapterLabel(ch) {
    return isChinese.value ? `第 ${ch} 章` : `Ch. ${ch}`
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

  async function loadChapter(scrollTarget) {
    const book = currentBook.value
    if (!book) return

    const bookId = selectedBookIndex.value + 1
    const version = selectedVersion.value
    const cacheKey = `${version}-${bookId}`

    loading.value = true
    error.value = ''
    verses.value = []

    try {
      if (!bookCache.has(cacheKey)) {
        const resp = await fetch(withBase(`/bible/${version}/${bookId}.json`))
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        bookCache.set(cacheKey, await resp.json())
      }

      const chapters = bookCache.get(cacheKey)
      const chapterData = chapters[selectedChapter.value - 1]

      if (!chapterData || chapterData.length === 0) {
        throw new Error('Chapter not found')
      }

      verses.value = chapterData.map((text, i) => ({
        verse: i + 1,
        text: text
      }))
    } catch {
      error.value = '加载失败，请稍后重试 Failed to load, please try again'
    } finally {
      loading.value = false
      await nextTick()
      if (scrollTarget?.value) {
        scrollTarget.value.scrollTop = 0
      }
    }
  }

  return {
    // Data
    otBooks: OT_BOOKS,
    ntBooks: NT_BOOKS,
    versionGroups: VERSION_GROUPS,
    // State
    selectedVersion,
    selectedBookIndex,
    selectedChapter,
    verses,
    loading,
    error,
    // Computed
    currentBook,
    chapterCount,
    hasPrev,
    hasNext,
    isChinese,
    otLabel,
    ntLabel,
    // Methods
    bookDisplayName,
    chapterLabel,
    onBookChange,
    prevChapter,
    nextChapter,
    loadChapter,
  }
}
