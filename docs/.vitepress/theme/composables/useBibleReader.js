import { ref, computed, nextTick } from 'vue'
import { ALL_BOOKS, OT_BOOKS, NT_BOOKS, CHINESE_VERSIONS, ENGLISH_VERSIONS, CHINESE_VERSION_IDS } from '../components/bible-data'

/**
 * 圣经阅读器核心逻辑
 * 管理版本选择、书卷导航、章节切换、经文加载
 */
export function useBibleReader() {
  const selectedVersion = ref('CUNPS')
  const selectedBookIndex = ref(42) // 约翰福音 John
  const selectedChapter = ref(1)
  const verses = ref([])
  const loading = ref(false)
  const error = ref('')

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

  function stripHtml(html) {
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

  async function loadChapter(scrollTarget) {
    const book = currentBook.value
    if (!book) return

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
    chineseVersions: CHINESE_VERSIONS,
    englishVersions: ENGLISH_VERSIONS,
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
