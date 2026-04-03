import { ref, nextTick } from 'vue'

/**
 * 全屏阅读器搜索功能
 * 管理搜索状态、匹配结果、高亮显示
 */
export function useBibleSearch(verses) {
  const showSearch = ref(false)
  const searchQuery = ref('')
  const searchMatches = ref([])
  const searchMatchIndex = ref(0)
  const searchInput = ref(null)
  const activeMatchEl = ref(null)

  function toggleSearch() {
    showSearch.value = !showSearch.value
    if (showSearch.value) {
      nextTick(() => searchInput.value?.focus())
    } else {
      resetSearch()
    }
  }

  function resetSearch() {
    searchQuery.value = ''
    searchMatches.value = []
    searchMatchIndex.value = 0
  }

  function onSearch() {
    if (!searchQuery.value.trim()) {
      searchMatches.value = []
      searchMatchIndex.value = 0
      return
    }
    const q = searchQuery.value.toLowerCase()
    searchMatches.value = verses.value
      .map((v, i) => v.text.toLowerCase().includes(q) ? i : -1)
      .filter(i => i !== -1)
    searchMatchIndex.value = 0
    scrollToMatch()
  }

  function nextSearchMatch() {
    if (searchMatches.value.length === 0) return
    searchMatchIndex.value = (searchMatchIndex.value + 1) % searchMatches.value.length
    scrollToMatch()
  }

  function prevSearchMatch() {
    if (searchMatches.value.length === 0) return
    searchMatchIndex.value = (searchMatchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length
    scrollToMatch()
  }

  function scrollToMatch() {
    nextTick(() => {
      if (activeMatchEl.value) {
        activeMatchEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }

  function isSearchHighlight(idx) {
    return searchMatches.value.length > 0 && searchMatches.value[searchMatchIndex.value] === idx
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function highlightText(text) {
    if (!searchQuery.value.trim()) return escapeHtml(text)
    const escaped = escapeHtml(text)
    const q = escapeHtml(searchQuery.value)
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return escaped.replace(regex, '<mark class="fs-search-mark">$1</mark>')
  }

  return {
    showSearch,
    searchQuery,
    searchMatches,
    searchMatchIndex,
    searchInput,
    activeMatchEl,
    toggleSearch,
    resetSearch,
    onSearch,
    nextSearchMatch,
    prevSearchMatch,
    isSearchHighlight,
    highlightText,
  }
}
