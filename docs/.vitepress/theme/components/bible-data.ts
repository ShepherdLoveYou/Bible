/**
 * Bible book/chapter data derived from digitalbiblesociety/browserbible
 * @license MIT/GPLv2
 * @see https://github.com/digitalbiblesociety/browserbible
 */

export interface BibleBook {
  osis: string
  chapters: number
  name: { en: string; zh: string }
}

const OT: BibleBook[] = [
  { osis: 'Gen', chapters: 50, name: { en: 'Genesis', zh: '创世记' } },
  { osis: 'Exod', chapters: 40, name: { en: 'Exodus', zh: '出埃及记' } },
  { osis: 'Lev', chapters: 27, name: { en: 'Leviticus', zh: '利未记' } },
  { osis: 'Num', chapters: 36, name: { en: 'Numbers', zh: '民数记' } },
  { osis: 'Deut', chapters: 34, name: { en: 'Deuteronomy', zh: '申命记' } },
  { osis: 'Josh', chapters: 24, name: { en: 'Joshua', zh: '约书亚记' } },
  { osis: 'Judg', chapters: 21, name: { en: 'Judges', zh: '士师记' } },
  { osis: 'Ruth', chapters: 4, name: { en: 'Ruth', zh: '路得记' } },
  { osis: '1Sam', chapters: 31, name: { en: '1 Samuel', zh: '撒母耳记上' } },
  { osis: '2Sam', chapters: 24, name: { en: '2 Samuel', zh: '撒母耳记下' } },
  { osis: '1Kgs', chapters: 22, name: { en: '1 Kings', zh: '列王纪上' } },
  { osis: '2Kgs', chapters: 25, name: { en: '2 Kings', zh: '列王纪下' } },
  { osis: '1Chr', chapters: 29, name: { en: '1 Chronicles', zh: '历代志上' } },
  { osis: '2Chr', chapters: 36, name: { en: '2 Chronicles', zh: '历代志下' } },
  { osis: 'Ezra', chapters: 10, name: { en: 'Ezra', zh: '以斯拉记' } },
  { osis: 'Neh', chapters: 13, name: { en: 'Nehemiah', zh: '尼希米记' } },
  { osis: 'Esth', chapters: 10, name: { en: 'Esther', zh: '以斯帖记' } },
  { osis: 'Job', chapters: 42, name: { en: 'Job', zh: '约伯记' } },
  { osis: 'Ps', chapters: 150, name: { en: 'Psalms', zh: '诗篇' } },
  { osis: 'Prov', chapters: 31, name: { en: 'Proverbs', zh: '箴言' } },
  { osis: 'Eccl', chapters: 12, name: { en: 'Ecclesiastes', zh: '传道书' } },
  { osis: 'Song', chapters: 8, name: { en: 'Song of Solomon', zh: '雅歌' } },
  { osis: 'Isa', chapters: 66, name: { en: 'Isaiah', zh: '以赛亚书' } },
  { osis: 'Jer', chapters: 52, name: { en: 'Jeremiah', zh: '耶利米书' } },
  { osis: 'Lam', chapters: 5, name: { en: 'Lamentations', zh: '耶利米哀歌' } },
  { osis: 'Ezek', chapters: 48, name: { en: 'Ezekiel', zh: '以西结书' } },
  { osis: 'Dan', chapters: 12, name: { en: 'Daniel', zh: '但以理书' } },
  { osis: 'Hos', chapters: 14, name: { en: 'Hosea', zh: '何西阿书' } },
  { osis: 'Joel', chapters: 3, name: { en: 'Joel', zh: '约珥书' } },
  { osis: 'Amos', chapters: 9, name: { en: 'Amos', zh: '阿摩司书' } },
  { osis: 'Obad', chapters: 1, name: { en: 'Obadiah', zh: '俄巴底亚书' } },
  { osis: 'Jonah', chapters: 4, name: { en: 'Jonah', zh: '约拿书' } },
  { osis: 'Mic', chapters: 7, name: { en: 'Micah', zh: '弥迦书' } },
  { osis: 'Nah', chapters: 3, name: { en: 'Nahum', zh: '那鸿书' } },
  { osis: 'Hab', chapters: 3, name: { en: 'Habakkuk', zh: '哈巴谷书' } },
  { osis: 'Zeph', chapters: 3, name: { en: 'Zephaniah', zh: '西番雅书' } },
  { osis: 'Hag', chapters: 2, name: { en: 'Haggai', zh: '哈该书' } },
  { osis: 'Zech', chapters: 14, name: { en: 'Zechariah', zh: '撒迦利亚书' } },
  { osis: 'Mal', chapters: 4, name: { en: 'Malachi', zh: '玛拉基书' } },
]

const NT: BibleBook[] = [
  { osis: 'Matt', chapters: 28, name: { en: 'Matthew', zh: '马太福音' } },
  { osis: 'Mark', chapters: 16, name: { en: 'Mark', zh: '马可福音' } },
  { osis: 'Luke', chapters: 24, name: { en: 'Luke', zh: '路加福音' } },
  { osis: 'John', chapters: 21, name: { en: 'John', zh: '约翰福音' } },
  { osis: 'Acts', chapters: 28, name: { en: 'Acts', zh: '使徒行传' } },
  { osis: 'Rom', chapters: 16, name: { en: 'Romans', zh: '罗马书' } },
  { osis: '1Cor', chapters: 16, name: { en: '1 Corinthians', zh: '哥林多前书' } },
  { osis: '2Cor', chapters: 13, name: { en: '2 Corinthians', zh: '哥林多后书' } },
  { osis: 'Gal', chapters: 6, name: { en: 'Galatians', zh: '加拉太书' } },
  { osis: 'Eph', chapters: 6, name: { en: 'Ephesians', zh: '以弗所书' } },
  { osis: 'Phil', chapters: 4, name: { en: 'Philippians', zh: '腓立比书' } },
  { osis: 'Col', chapters: 4, name: { en: 'Colossians', zh: '歌罗西书' } },
  { osis: '1Thess', chapters: 5, name: { en: '1 Thessalonians', zh: '帖撒罗尼迦前书' } },
  { osis: '2Thess', chapters: 3, name: { en: '2 Thessalonians', zh: '帖撒罗尼迦后书' } },
  { osis: '1Tim', chapters: 6, name: { en: '1 Timothy', zh: '提摩太前书' } },
  { osis: '2Tim', chapters: 4, name: { en: '2 Timothy', zh: '提摩太后书' } },
  { osis: 'Titus', chapters: 3, name: { en: 'Titus', zh: '提多书' } },
  { osis: 'Phlm', chapters: 1, name: { en: 'Philemon', zh: '腓利门书' } },
  { osis: 'Heb', chapters: 13, name: { en: 'Hebrews', zh: '希伯来书' } },
  { osis: 'Jas', chapters: 5, name: { en: 'James', zh: '雅各书' } },
  { osis: '1Pet', chapters: 5, name: { en: '1 Peter', zh: '彼得前书' } },
  { osis: '2Pet', chapters: 3, name: { en: '2 Peter', zh: '彼得后书' } },
  { osis: '1John', chapters: 5, name: { en: '1 John', zh: '约翰一书' } },
  { osis: '2John', chapters: 1, name: { en: '2 John', zh: '约翰二书' } },
  { osis: '3John', chapters: 1, name: { en: '3 John', zh: '约翰三书' } },
  { osis: 'Jude', chapters: 1, name: { en: 'Jude', zh: '犹大书' } },
  { osis: 'Rev', chapters: 22, name: { en: 'Revelation', zh: '启示录' } },
]

export const OT_BOOKS = OT
export const NT_BOOKS = NT
export const ALL_BOOKS = [...OT, ...NT]

/** 圣经版本定义 */
export interface BibleVersion {
  id: string
  name: string
}

/** 按语言分组的版本列表 (数据来自 thiagobodruk/bible) */
export interface LanguageGroup {
  label: string
  versions: BibleVersion[]
}

export const VERSION_GROUPS: LanguageGroup[] = [
  {
    label: '中文 Chinese',
    versions: [
      { id: 'zh_cuv', name: '和合本 (CUV)' },
      { id: 'zh_ncv', name: '新译本 (NCV)' },
    ],
  },
  {
    label: 'English',
    versions: [
      { id: 'en_kjv', name: 'KJV' },
      { id: 'en_bbe', name: 'BBE' },
    ],
  },
  {
    label: '한국어 Korean',
    versions: [{ id: 'ko_ko', name: '한국어' }],
  },
  {
    label: 'Español Spanish',
    versions: [{ id: 'es_rvr', name: 'Reina Valera' }],
  },
  {
    label: 'Français French',
    versions: [{ id: 'fr_apee', name: "Bible de l'Épée" }],
  },
  {
    label: 'Deutsch German',
    versions: [{ id: 'de_schlachter', name: 'Schlachter' }],
  },
  {
    label: 'Português Portuguese',
    versions: [
      { id: 'pt_nvi', name: 'NVI' },
      { id: 'pt_aa', name: 'Almeida Revisada' },
      { id: 'pt_acf', name: 'Almeida Corrigida' },
    ],
  },
  {
    label: 'Русский Russian',
    versions: [{ id: 'ru_synodal', name: 'Синодальный' }],
  },
  {
    label: 'العربية Arabic',
    versions: [{ id: 'ar_svd', name: 'Arabic Bible' }],
  },
  {
    label: 'Ελληνικά Greek',
    versions: [{ id: 'el_greek', name: 'Modern Greek' }],
  },
  {
    label: 'Tiếng Việt Vietnamese',
    versions: [{ id: 'vi_vietnamese', name: 'Tiếng Việt' }],
  },
  {
    label: 'Suomi Finnish',
    versions: [
      { id: 'fi_finnish', name: 'Finnish Bible' },
      { id: 'fi_pr', name: 'Pyhä Raamattu' },
    ],
  },
  {
    label: 'Română Romanian',
    versions: [{ id: 'ro_cornilescu', name: 'Cornilescu' }],
  },
  {
    label: 'Esperanto',
    versions: [{ id: 'eo_esperanto', name: 'Esperanto' }],
  },
]

/** All version IDs (flat) */
export const ALL_VERSIONS = VERSION_GROUPS.flatMap(g => g.versions)

/** Chinese version IDs for UI language detection */
export const CHINESE_VERSION_IDS = new Set(['zh_cuv', 'zh_ncv'])
