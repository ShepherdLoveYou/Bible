#!/usr/bin/env node
/**
 * Download Bible data from thiagobodruk/bible (GitHub)
 * Split into per-book JSON files for efficient lazy loading
 * Output: docs/public/bible/{version}/{bookId}.json
 *
 * Each book file is a 2D array: chapters[chapterIndex][verseIndex] = verse text
 * @license MIT (thiagobodruk/bible), CC BY-NC (Bible content)
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json'
const OUTPUT = join(process.cwd(), 'docs/public/bible')

const VERSIONS = [
  'ar_svd', 'de_schlachter', 'el_greek', 'en_bbe', 'en_kjv',
  'eo_esperanto', 'es_rvr', 'fi_finnish', 'fi_pr', 'fr_apee',
  'ko_ko', 'pt_aa', 'pt_acf', 'pt_nvi', 'ro_cornilescu',
  'ru_synodal', 'vi_vietnamese', 'zh_cuv', 'zh_ncv'
]

// zh_cuv has spaces between every CJK character — an artifact from the crawler
const CJK_SPACE_FIX = new Set(['zh_cuv'])

/**
 * For zh_cuv: remove spaces between CJK characters/punctuation
 * Keeps spaces between Latin characters (e.g. proper nouns)
 */
function cleanChineseSpaces(text) {
  // CJK Unified + CJK punctuation + fullwidth forms
  const cjk = '\\u2E80-\\u9FFF\\uF900-\\uFAFF\\uFE30-\\uFE4F\\uFF00-\\uFFEF\\u3000-\\u303F'
  // Remove space when at least one side is CJK
  return text
    .replace(new RegExp(`([${cjk}]) `, 'g'), '$1')
    .replace(new RegExp(` ([${cjk}])`, 'g'), '$1')
    .trim()
}

function cleanVerse(text, version) {
  if (CJK_SPACE_FIX.has(version)) return cleanChineseSpaces(text)
  return text.trim()
}

async function downloadVersion(version) {
  const dir = join(OUTPUT, version)
  // Skip if already fully downloaded (66 books)
  if (existsSync(join(dir, '66.json'))) {
    console.log(`  [skip] ${version} (already exists)`)
    return
  }

  const url = `${BASE_URL}/${version}.json`
  console.log(`  Downloading ${version}...`)
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${version}`)
  const books = await resp.json()

  mkdirSync(dir, { recursive: true })

  books.forEach((book, i) => {
    const chapters = book.chapters.map(chapter =>
      chapter.map(verse => cleanVerse(verse, version))
    )
    writeFileSync(join(dir, `${i + 1}.json`), JSON.stringify(chapters))
  })

  console.log(`  [done] ${version}: ${books.length} books`)
}

async function main() {
  console.log(`Downloading ${VERSIONS.length} Bible versions from thiagobodruk/bible...\n`)
  mkdirSync(OUTPUT, { recursive: true })

  // Download 4 versions concurrently
  for (let i = 0; i < VERSIONS.length; i += 4) {
    const batch = VERSIONS.slice(i, i + 4)
    await Promise.all(batch.map(v => downloadVersion(v).catch(e => {
      console.error(`  [FAIL] ${v}: ${e.message}`)
    })))
  }

  console.log('\nAll downloads complete.')
  console.log(`Output: ${OUTPUT}`)
}

main()
