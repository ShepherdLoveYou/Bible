/**
 * Bible book/chapter data derived from digitalbiblesociety/browserbible
 * @license MIT/GPLv2
 * @see https://github.com/digitalbiblesociety/browserbible
 */

/** Supported language codes */
export type LangCode = 'en' | 'zh' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'ar' | 'el' | 'vi' | 'fi' | 'ro' | 'eo'

export interface BibleBook {
  osis: string
  chapters: number
  name: Record<string, string>
}

/**
 * Book names in all supported languages.
 * Index = book order (0–65). Each entry: { lang: name }.
 * English ('en') is always present as fallback.
 */
const BOOK_NAMES: Record<string, string>[] = [
  // ── Old Testament (0–38) ──
  /* 0  */ { en: 'Genesis', zh: '创世记', ko: '창세기', es: 'Génesis', fr: 'Genèse', de: '1. Mose', pt: 'Gênesis', ru: 'Бытие', ar: 'تكوين', el: 'Γένεσις', vi: 'Sáng Thế Ký', fi: '1. Mooseksen kirja', ro: 'Geneza', eo: 'Genezo' },
  /* 1  */ { en: 'Exodus', zh: '出埃及记', ko: '출애굽기', es: 'Éxodo', fr: 'Exode', de: '2. Mose', pt: 'Êxodo', ru: 'Исход', ar: 'خروج', el: 'Έξοδος', vi: 'Xuất Ê-díp-tô Ký', fi: '2. Mooseksen kirja', ro: 'Exodul', eo: 'Eliro' },
  /* 2  */ { en: 'Leviticus', zh: '利未记', ko: '레위기', es: 'Levítico', fr: 'Lévitique', de: '3. Mose', pt: 'Levítico', ru: 'Левит', ar: 'لاويين', el: 'Λευιτικόν', vi: 'Lê-vi Ký', fi: '3. Mooseksen kirja', ro: 'Leviticul', eo: 'Levidoj' },
  /* 3  */ { en: 'Numbers', zh: '民数记', ko: '민수기', es: 'Números', fr: 'Nombres', de: '4. Mose', pt: 'Números', ru: 'Числа', ar: 'عدد', el: 'Αριθμοί', vi: 'Dân Số Ký', fi: '4. Mooseksen kirja', ro: 'Numeri', eo: 'Nombroj' },
  /* 4  */ { en: 'Deuteronomy', zh: '申命记', ko: '신명기', es: 'Deuteronomio', fr: 'Deutéronome', de: '5. Mose', pt: 'Deuteronômio', ru: 'Второзаконие', ar: 'تثنية', el: 'Δευτερονόμιον', vi: 'Phục Truyền Luật Lệ Ký', fi: '5. Mooseksen kirja', ro: 'Deuteronomul', eo: 'Readmono' },
  /* 5  */ { en: 'Joshua', zh: '约书亚记', ko: '여호수아', es: 'Josué', fr: 'Josué', de: 'Josua', pt: 'Josué', ru: 'Иисус Навин', ar: 'يشوع', el: 'Ιησούς του Ναυή', vi: 'Giô-suê', fi: 'Joosuan kirja', ro: 'Iosua', eo: 'Josuo' },
  /* 6  */ { en: 'Judges', zh: '士师记', ko: '사사기', es: 'Jueces', fr: 'Juges', de: 'Richter', pt: 'Juízes', ru: 'Судей', ar: 'قضاة', el: 'Κριταί', vi: 'Các Quan Xét', fi: 'Tuomarien kirja', ro: 'Judecătorii', eo: 'Juĝistoj' },
  /* 7  */ { en: 'Ruth', zh: '路得记', ko: '룻기', es: 'Rut', fr: 'Ruth', de: 'Ruth', pt: 'Rute', ru: 'Руфь', ar: 'راعوث', el: 'Ρουθ', vi: 'Ru-tơ', fi: 'Ruutin kirja', ro: 'Rut', eo: 'Rut' },
  /* 8  */ { en: '1 Samuel', zh: '撒母耳记上', ko: '사무엘상', es: '1 Samuel', fr: '1 Samuel', de: '1. Samuel', pt: '1 Samuel', ru: '1 Царств', ar: '1 صموئيل', el: '1 Σαμουήλ', vi: '1 Sa-mu-ên', fi: '1. Samuelin kirja', ro: '1 Samuel', eo: '1 Samuelo' },
  /* 9  */ { en: '2 Samuel', zh: '撒母耳记下', ko: '사무엘하', es: '2 Samuel', fr: '2 Samuel', de: '2. Samuel', pt: '2 Samuel', ru: '2 Царств', ar: '2 صموئيل', el: '2 Σαμουήλ', vi: '2 Sa-mu-ên', fi: '2. Samuelin kirja', ro: '2 Samuel', eo: '2 Samuelo' },
  /* 10 */ { en: '1 Kings', zh: '列王纪上', ko: '열왕기상', es: '1 Reyes', fr: '1 Rois', de: '1. Könige', pt: '1 Reis', ru: '3 Царств', ar: '1 ملوك', el: '1 Βασιλέων', vi: '1 Các Vua', fi: '1. Kuninkaiden kirja', ro: '1 Împărați', eo: '1 Reĝoj' },
  /* 11 */ { en: '2 Kings', zh: '列王纪下', ko: '열왕기하', es: '2 Reyes', fr: '2 Rois', de: '2. Könige', pt: '2 Reis', ru: '4 Царств', ar: '2 ملوك', el: '2 Βασιλέων', vi: '2 Các Vua', fi: '2. Kuninkaiden kirja', ro: '2 Împărați', eo: '2 Reĝoj' },
  /* 12 */ { en: '1 Chronicles', zh: '历代志上', ko: '역대상', es: '1 Crónicas', fr: '1 Chroniques', de: '1. Chronik', pt: '1 Crônicas', ru: '1 Паралипоменон', ar: '1 أخبار', el: '1 Χρονικών', vi: '1 Sử Ký', fi: '1. Aikakirja', ro: '1 Cronici', eo: '1 Kronikoj' },
  /* 13 */ { en: '2 Chronicles', zh: '历代志下', ko: '역대하', es: '2 Crónicas', fr: '2 Chroniques', de: '2. Chronik', pt: '2 Crônicas', ru: '2 Паралипоменон', ar: '2 أخبار', el: '2 Χρονικών', vi: '2 Sử Ký', fi: '2. Aikakirja', ro: '2 Cronici', eo: '2 Kronikoj' },
  /* 14 */ { en: 'Ezra', zh: '以斯拉记', ko: '에스라', es: 'Esdras', fr: 'Esdras', de: 'Esra', pt: 'Esdras', ru: 'Ездра', ar: 'عزرا', el: 'Έσδρας', vi: 'E-xơ-ra', fi: 'Esran kirja', ro: 'Ezra', eo: 'Ezra' },
  /* 15 */ { en: 'Nehemiah', zh: '尼希米记', ko: '느헤미야', es: 'Nehemías', fr: 'Néhémie', de: 'Nehemia', pt: 'Neemias', ru: 'Неемия', ar: 'نحميا', el: 'Νεεμίας', vi: 'Nê-hê-mi', fi: 'Nehemian kirja', ro: 'Neemia', eo: 'Neĥemja' },
  /* 16 */ { en: 'Esther', zh: '以斯帖记', ko: '에스더', es: 'Ester', fr: 'Esther', de: 'Esther', pt: 'Ester', ru: 'Есфирь', ar: 'أستير', el: 'Εσθήρ', vi: 'Ê-xơ-tê', fi: 'Esterin kirja', ro: 'Estera', eo: 'Ester' },
  /* 17 */ { en: 'Job', zh: '约伯记', ko: '욥기', es: 'Job', fr: 'Job', de: 'Hiob', pt: 'Jó', ru: 'Иов', ar: 'أيوب', el: 'Ιώβ', vi: 'Gióp', fi: 'Jobin kirja', ro: 'Iov', eo: 'Ijob' },
  /* 18 */ { en: 'Psalms', zh: '诗篇', ko: '시편', es: 'Salmos', fr: 'Psaumes', de: 'Psalmen', pt: 'Salmos', ru: 'Псалтирь', ar: 'مزامير', el: 'Ψαλμοί', vi: 'Thi Thiên', fi: 'Psalmit', ro: 'Psalmii', eo: 'Psalmaro' },
  /* 19 */ { en: 'Proverbs', zh: '箴言', ko: '잠언', es: 'Proverbios', fr: 'Proverbes', de: 'Sprüche', pt: 'Provérbios', ru: 'Притчи', ar: 'أمثال', el: 'Παροιμίαι', vi: 'Châm Ngôn', fi: 'Sananlaskut', ro: 'Proverbele', eo: 'Sentencoj' },
  /* 20 */ { en: 'Ecclesiastes', zh: '传道书', ko: '전도서', es: 'Eclesiastés', fr: 'Ecclésiaste', de: 'Prediger', pt: 'Eclesiastes', ru: 'Екклесиаст', ar: 'جامعة', el: 'Εκκλησιαστής', vi: 'Truyền Đạo', fi: 'Saarnaaja', ro: 'Eclesiastul', eo: 'Predikanto' },
  /* 21 */ { en: 'Song of Solomon', zh: '雅歌', ko: '아가', es: 'Cantares', fr: 'Cantique', de: 'Hohelied', pt: 'Cântico dos Cânticos', ru: 'Песня Песней', ar: 'نشيد الأنشاد', el: 'Άσμα Ασμάτων', vi: 'Nhã Ca', fi: 'Laulujen laulu', ro: 'Cântarea Cântărilor', eo: 'Kantiko' },
  /* 22 */ { en: 'Isaiah', zh: '以赛亚书', ko: '이사야', es: 'Isaías', fr: 'Ésaïe', de: 'Jesaja', pt: 'Isaías', ru: 'Исаия', ar: 'إشعياء', el: 'Ησαΐας', vi: 'Ê-sai', fi: 'Jesajan kirja', ro: 'Isaia', eo: 'Jesaja' },
  /* 23 */ { en: 'Jeremiah', zh: '耶利米书', ko: '예레미야', es: 'Jeremías', fr: 'Jérémie', de: 'Jeremia', pt: 'Jeremias', ru: 'Иеремия', ar: 'إرميا', el: 'Ιερεμίας', vi: 'Giê-rê-mi', fi: 'Jeremian kirja', ro: 'Ieremia', eo: 'Jeremia' },
  /* 24 */ { en: 'Lamentations', zh: '耶利米哀歌', ko: '예레미야애가', es: 'Lamentaciones', fr: 'Lamentations', de: 'Klagelieder', pt: 'Lamentações', ru: 'Плач Иеремии', ar: 'مراثي', el: 'Θρήνοι', vi: 'Ca Thương', fi: 'Valitusvirret', ro: 'Plângerile', eo: 'Plorkantoj' },
  /* 25 */ { en: 'Ezekiel', zh: '以西结书', ko: '에스겔', es: 'Ezequiel', fr: 'Ézéchiel', de: 'Hesekiel', pt: 'Ezequiel', ru: 'Иезекииль', ar: 'حزقيال', el: 'Ιεζεκιήλ', vi: 'Ê-xê-chi-ên', fi: 'Hesekielin kirja', ro: 'Ezechiel', eo: 'Jeĥezkel' },
  /* 26 */ { en: 'Daniel', zh: '但以理书', ko: '다니엘', es: 'Daniel', fr: 'Daniel', de: 'Daniel', pt: 'Daniel', ru: 'Даниил', ar: 'دانيال', el: 'Δανιήλ', vi: 'Đa-ni-ên', fi: 'Danielin kirja', ro: 'Daniel', eo: 'Daniel' },
  /* 27 */ { en: 'Hosea', zh: '何西阿书', ko: '호세아', es: 'Oseas', fr: 'Osée', de: 'Hosea', pt: 'Oséias', ru: 'Осия', ar: 'هوشع', el: 'Ωσηέ', vi: 'Ô-sê', fi: 'Hoosean kirja', ro: 'Osea', eo: 'Hoŝea' },
  /* 28 */ { en: 'Joel', zh: '约珥书', ko: '요엘', es: 'Joel', fr: 'Joël', de: 'Joel', pt: 'Joel', ru: 'Иоиль', ar: 'يوئيل', el: 'Ιωήλ', vi: 'Giô-ên', fi: 'Joelin kirja', ro: 'Ioel', eo: 'Joel' },
  /* 29 */ { en: 'Amos', zh: '阿摩司书', ko: '아모스', es: 'Amós', fr: 'Amos', de: 'Amos', pt: 'Amós', ru: 'Амос', ar: 'عاموس', el: 'Αμώς', vi: 'A-mốt', fi: 'Aamoksen kirja', ro: 'Amos', eo: 'Amos' },
  /* 30 */ { en: 'Obadiah', zh: '俄巴底亚书', ko: '오바댜', es: 'Abdías', fr: 'Abdias', de: 'Obadja', pt: 'Obadias', ru: 'Авдий', ar: 'عوبديا', el: 'Αβδιού', vi: 'Áp-đia', fi: 'Obadjan kirja', ro: 'Obadia', eo: 'Obadja' },
  /* 31 */ { en: 'Jonah', zh: '约拿书', ko: '요나', es: 'Jonás', fr: 'Jonas', de: 'Jona', pt: 'Jonas', ru: 'Иона', ar: 'يونان', el: 'Ιωνάς', vi: 'Giô-na', fi: 'Joonan kirja', ro: 'Iona', eo: 'Jona' },
  /* 32 */ { en: 'Micah', zh: '弥迦书', ko: '미가', es: 'Miqueas', fr: 'Michée', de: 'Micha', pt: 'Miquéias', ru: 'Михей', ar: 'ميخا', el: 'Μιχαίας', vi: 'Mi-chê', fi: 'Miikan kirja', ro: 'Mica', eo: 'Miĥa' },
  /* 33 */ { en: 'Nahum', zh: '那鸿书', ko: '나훔', es: 'Nahúm', fr: 'Nahum', de: 'Nahum', pt: 'Naum', ru: 'Наум', ar: 'ناحوم', el: 'Ναούμ', vi: 'Na-hum', fi: 'Nahumin kirja', ro: 'Naum', eo: 'Naĥum' },
  /* 34 */ { en: 'Habakkuk', zh: '哈巴谷书', ko: '하박국', es: 'Habacuc', fr: 'Habakuk', de: 'Habakuk', pt: 'Habacuque', ru: 'Аввакум', ar: 'حبقوق', el: 'Αββακούμ', vi: 'Ha-ba-cúc', fi: 'Habakukin kirja', ro: 'Habacuc', eo: 'Ĥabakuk' },
  /* 35 */ { en: 'Zephaniah', zh: '西番雅书', ko: '스바냐', es: 'Sofonías', fr: 'Sophonie', de: 'Zephanja', pt: 'Sofonias', ru: 'Софония', ar: 'صفنيا', el: 'Σοφονίας', vi: 'Sô-phô-ni', fi: 'Sefanjan kirja', ro: 'Țefania', eo: 'Cefanja' },
  /* 36 */ { en: 'Haggai', zh: '哈该书', ko: '학개', es: 'Hageo', fr: 'Aggée', de: 'Haggai', pt: 'Ageu', ru: 'Аггей', ar: 'حجي', el: 'Αγγαίος', vi: 'A-ghê', fi: 'Haggain kirja', ro: 'Hagai', eo: 'Ĥagaj' },
  /* 37 */ { en: 'Zechariah', zh: '撒迦利亚书', ko: '스가랴', es: 'Zacarías', fr: 'Zacharie', de: 'Sacharja', pt: 'Zacarias', ru: 'Захария', ar: 'زكريا', el: 'Ζαχαρίας', vi: 'Xa-cha-ri', fi: 'Sakarjan kirja', ro: 'Zaharia', eo: 'Zeĥarja' },
  /* 38 */ { en: 'Malachi', zh: '玛拉基书', ko: '말라기', es: 'Malaquías', fr: 'Malachie', de: 'Maleachi', pt: 'Malaquias', ru: 'Малахия', ar: 'ملاخي', el: 'Μαλαχίας', vi: 'Ma-la-chi', fi: 'Malakian kirja', ro: 'Maleahi', eo: 'Malaĥi' },
  // ── New Testament (39–65) ──
  /* 39 */ { en: 'Matthew', zh: '马太福音', ko: '마태복음', es: 'Mateo', fr: 'Matthieu', de: 'Matthäus', pt: 'Mateus', ru: 'Матфея', ar: 'متى', el: 'Ματθαίος', vi: 'Ma-thi-ơ', fi: 'Matteuksen evankeliumi', ro: 'Matei', eo: 'Mateo' },
  /* 40 */ { en: 'Mark', zh: '马可福音', ko: '마가복음', es: 'Marcos', fr: 'Marc', de: 'Markus', pt: 'Marcos', ru: 'Марка', ar: 'مرقس', el: 'Μάρκος', vi: 'Mác', fi: 'Markuksen evankeliumi', ro: 'Marcu', eo: 'Marko' },
  /* 41 */ { en: 'Luke', zh: '路加福音', ko: '누가복음', es: 'Lucas', fr: 'Luc', de: 'Lukas', pt: 'Lucas', ru: 'Луки', ar: 'لوقا', el: 'Λουκάς', vi: 'Lu-ca', fi: 'Luukkaan evankeliumi', ro: 'Luca', eo: 'Luko' },
  /* 42 */ { en: 'John', zh: '约翰福音', ko: '요한복음', es: 'Juan', fr: 'Jean', de: 'Johannes', pt: 'João', ru: 'Иоанна', ar: 'يوحنا', el: 'Ιωάννης', vi: 'Giăng', fi: 'Johanneksen evankeliumi', ro: 'Ioan', eo: 'Johano' },
  /* 43 */ { en: 'Acts', zh: '使徒行传', ko: '사도행전', es: 'Hechos', fr: 'Actes', de: 'Apostelgeschichte', pt: 'Atos', ru: 'Деяния', ar: 'أعمال الرسل', el: 'Πράξεις', vi: 'Công Vụ', fi: 'Apostolien teot', ro: 'Faptele Apostolilor', eo: 'Agoj' },
  /* 44 */ { en: 'Romans', zh: '罗马书', ko: '로마서', es: 'Romanos', fr: 'Romains', de: 'Römer', pt: 'Romanos', ru: 'Римлянам', ar: 'رومية', el: 'Ρωμαίους', vi: 'Rô-ma', fi: 'Roomalaiskirje', ro: 'Romani', eo: 'Romanoj' },
  /* 45 */ { en: '1 Corinthians', zh: '哥林多前书', ko: '고린도전서', es: '1 Corintios', fr: '1 Corinthiens', de: '1. Korinther', pt: '1 Coríntios', ru: '1 Коринфянам', ar: '1 كورنثوس', el: '1 Κορινθίους', vi: '1 Cô-rinh-tô', fi: '1. Korinttilaiskirje', ro: '1 Corinteni', eo: '1 Korintanoj' },
  /* 46 */ { en: '2 Corinthians', zh: '哥林多后书', ko: '고린도후서', es: '2 Corintios', fr: '2 Corinthiens', de: '2. Korinther', pt: '2 Coríntios', ru: '2 Коринфянам', ar: '2 كورنثوس', el: '2 Κορινθίους', vi: '2 Cô-rinh-tô', fi: '2. Korinttilaiskirje', ro: '2 Corinteni', eo: '2 Korintanoj' },
  /* 47 */ { en: 'Galatians', zh: '加拉太书', ko: '갈라디아서', es: 'Gálatas', fr: 'Galates', de: 'Galater', pt: 'Gálatas', ru: 'Галатам', ar: 'غلاطية', el: 'Γαλάτας', vi: 'Ga-la-ti', fi: 'Galatalaiskirje', ro: 'Galateni', eo: 'Galatoj' },
  /* 48 */ { en: 'Ephesians', zh: '以弗所书', ko: '에베소서', es: 'Efesios', fr: 'Éphésiens', de: 'Epheser', pt: 'Efésios', ru: 'Ефесянам', ar: 'أفسس', el: 'Εφεσίους', vi: 'Ê-phê-sô', fi: 'Efesolaiskirje', ro: 'Efeseni', eo: 'Efezanoj' },
  /* 49 */ { en: 'Philippians', zh: '腓立比书', ko: '빌립보서', es: 'Filipenses', fr: 'Philippiens', de: 'Philipper', pt: 'Filipenses', ru: 'Филиппийцам', ar: 'فيلبي', el: 'Φιλιππησίους', vi: 'Phi-líp', fi: 'Filippiläiskirje', ro: 'Filipeni', eo: 'Filipianoj' },
  /* 50 */ { en: 'Colossians', zh: '歌罗西书', ko: '골로새서', es: 'Colosenses', fr: 'Colossiens', de: 'Kolosser', pt: 'Colossenses', ru: 'Колоссянам', ar: 'كولوسي', el: 'Κολοσσαείς', vi: 'Cô-lô-se', fi: 'Kolossalaiskirje', ro: 'Coloseni', eo: 'Kolosanoj' },
  /* 51 */ { en: '1 Thessalonians', zh: '帖撒罗尼迦前书', ko: '데살로니가전서', es: '1 Tesalonicenses', fr: '1 Thessaloniciens', de: '1. Thessalonicher', pt: '1 Tessalonicenses', ru: '1 Фессалоникийцам', ar: '1 تسالونيكي', el: '1 Θεσσαλονικείς', vi: '1 Tê-sa-lô-ni-ca', fi: '1. Tessalonikalaiskirje', ro: '1 Tesaloniceni', eo: '1 Tesalonikanoj' },
  /* 52 */ { en: '2 Thessalonians', zh: '帖撒罗尼迦后书', ko: '데살로니가후서', es: '2 Tesalonicenses', fr: '2 Thessaloniciens', de: '2. Thessalonicher', pt: '2 Tessalonicenses', ru: '2 Фессалоникийцам', ar: '2 تسالونيكي', el: '2 Θεσσαλονικείς', vi: '2 Tê-sa-lô-ni-ca', fi: '2. Tessalonikalaiskirje', ro: '2 Tesaloniceni', eo: '2 Tesalonikanoj' },
  /* 53 */ { en: '1 Timothy', zh: '提摩太前书', ko: '디모데전서', es: '1 Timoteo', fr: '1 Timothée', de: '1. Timotheus', pt: '1 Timóteo', ru: '1 Тимофею', ar: '1 تيموثاوس', el: '1 Τιμόθεον', vi: '1 Ti-mô-thê', fi: '1. Timoteuskirje', ro: '1 Timotei', eo: '1 Timoteo' },
  /* 54 */ { en: '2 Timothy', zh: '提摩太后书', ko: '디모데후서', es: '2 Timoteo', fr: '2 Timothée', de: '2. Timotheus', pt: '2 Timóteo', ru: '2 Тимофею', ar: '2 تيموثاوس', el: '2 Τιμόθεον', vi: '2 Ti-mô-thê', fi: '2. Timoteuskirje', ro: '2 Timotei', eo: '2 Timoteo' },
  /* 55 */ { en: 'Titus', zh: '提多书', ko: '디도서', es: 'Tito', fr: 'Tite', de: 'Titus', pt: 'Tito', ru: 'Титу', ar: 'تيطس', el: 'Τίτον', vi: 'Tít', fi: 'Tituksen kirje', ro: 'Tit', eo: 'Tito' },
  /* 56 */ { en: 'Philemon', zh: '腓利门书', ko: '빌레몬서', es: 'Filemón', fr: 'Philémon', de: 'Philemon', pt: 'Filemom', ru: 'Филимону', ar: 'فليمون', el: 'Φιλήμονα', vi: 'Phi-lê-môn', fi: 'Filemonin kirje', ro: 'Filimon', eo: 'Filemono' },
  /* 57 */ { en: 'Hebrews', zh: '希伯来书', ko: '히브리서', es: 'Hebreos', fr: 'Hébreux', de: 'Hebräer', pt: 'Hebreus', ru: 'Евреям', ar: 'عبرانيين', el: 'Εβραίους', vi: 'Hê-bơ-rơ', fi: 'Heprealaiskirje', ro: 'Evrei', eo: 'Hebreoj' },
  /* 58 */ { en: 'James', zh: '雅各书', ko: '야고보서', es: 'Santiago', fr: 'Jacques', de: 'Jakobus', pt: 'Tiago', ru: 'Иакова', ar: 'يعقوب', el: 'Ιάκωβος', vi: 'Gia-cơ', fi: 'Jaakobin kirje', ro: 'Iacov', eo: 'Jakobo' },
  /* 59 */ { en: '1 Peter', zh: '彼得前书', ko: '베드로전서', es: '1 Pedro', fr: '1 Pierre', de: '1. Petrus', pt: '1 Pedro', ru: '1 Петра', ar: '1 بطرس', el: '1 Πέτρου', vi: '1 Phi-e-rơ', fi: '1. Pietarin kirje', ro: '1 Petru', eo: '1 Petro' },
  /* 60 */ { en: '2 Peter', zh: '彼得后书', ko: '베드로후서', es: '2 Pedro', fr: '2 Pierre', de: '2. Petrus', pt: '2 Pedro', ru: '2 Петра', ar: '2 بطرس', el: '2 Πέτρου', vi: '2 Phi-e-rơ', fi: '2. Pietarin kirje', ro: '2 Petru', eo: '2 Petro' },
  /* 61 */ { en: '1 John', zh: '约翰一书', ko: '요한1서', es: '1 Juan', fr: '1 Jean', de: '1. Johannes', pt: '1 João', ru: '1 Иоанна', ar: '1 يوحنا', el: '1 Ιωάννου', vi: '1 Giăng', fi: '1. Johanneksen kirje', ro: '1 Ioan', eo: '1 Johano' },
  /* 62 */ { en: '2 John', zh: '约翰二书', ko: '요한2서', es: '2 Juan', fr: '2 Jean', de: '2. Johannes', pt: '2 João', ru: '2 Иоанна', ar: '2 يوحنا', el: '2 Ιωάννου', vi: '2 Giăng', fi: '2. Johanneksen kirje', ro: '2 Ioan', eo: '2 Johano' },
  /* 63 */ { en: '3 John', zh: '约翰三书', ko: '요한3서', es: '3 Juan', fr: '3 Jean', de: '3. Johannes', pt: '3 João', ru: '3 Иоанна', ar: '3 يوحنا', el: '3 Ιωάννου', vi: '3 Giăng', fi: '3. Johanneksen kirje', ro: '3 Ioan', eo: '3 Johano' },
  /* 64 */ { en: 'Jude', zh: '犹大书', ko: '유다서', es: 'Judas', fr: 'Jude', de: 'Judas', pt: 'Judas', ru: 'Иуды', ar: 'يهوذا', el: 'Ιούδας', vi: 'Giu-đe', fi: 'Juudaksen kirje', ro: 'Iuda', eo: 'Judaso' },
  /* 65 */ { en: 'Revelation', zh: '启示录', ko: '요한계시록', es: 'Apocalipsis', fr: 'Apocalypse', de: 'Offenbarung', pt: 'Apocalipse', ru: 'Откровение', ar: 'رؤيا', el: 'Αποκάλυψις', vi: 'Khải Huyền', fi: 'Ilmestyskirja', ro: 'Apocalipsa', eo: 'Apokalipso' },
]

const OT_OSIS = [
  'Gen','Exod','Lev','Num','Deut','Josh','Judg','Ruth','1Sam','2Sam',
  '1Kgs','2Kgs','1Chr','2Chr','Ezra','Neh','Esth','Job','Ps','Prov',
  'Eccl','Song','Isa','Jer','Lam','Ezek','Dan','Hos','Joel','Amos',
  'Obad','Jonah','Mic','Nah','Hab','Zeph','Hag','Zech','Mal',
]

const OT_CHAPTERS = [
  50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,
  12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
]

const NT_OSIS = [
  'Matt','Mark','Luke','John','Acts','Rom','1Cor','2Cor','Gal','Eph',
  'Phil','Col','1Thess','2Thess','1Tim','2Tim','Titus','Phlm','Heb',
  'Jas','1Pet','2Pet','1John','2John','3John','Jude','Rev',
]

const NT_CHAPTERS = [
  28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22,
]

function buildBooks(osisList: string[], chapterList: number[], offset: number): BibleBook[] {
  return osisList.map((osis, i) => ({
    osis,
    chapters: chapterList[i],
    name: BOOK_NAMES[offset + i],
  }))
}

const OT = buildBooks(OT_OSIS, OT_CHAPTERS, 0)
const NT = buildBooks(NT_OSIS, NT_CHAPTERS, 39)

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
  lang: LangCode
  versions: BibleVersion[]
}

export const VERSION_GROUPS: LanguageGroup[] = [
  {
    label: '中文 Chinese',
    lang: 'zh',
    versions: [
      { id: 'zh_cuv', name: '和合本 (CUV)' },
      { id: 'zh_ncv', name: '新译本 (NCV)' },
    ],
  },
  {
    label: 'English',
    lang: 'en',
    versions: [
      { id: 'en_kjv', name: 'KJV' },
      { id: 'en_bbe', name: 'BBE' },
    ],
  },
  {
    label: '한국어 Korean',
    lang: 'ko',
    versions: [{ id: 'ko_ko', name: '한국어' }],
  },
  {
    label: 'Español Spanish',
    lang: 'es',
    versions: [{ id: 'es_rvr', name: 'Reina Valera' }],
  },
  {
    label: 'Français French',
    lang: 'fr',
    versions: [{ id: 'fr_apee', name: "Bible de l'Épée" }],
  },
  {
    label: 'Deutsch German',
    lang: 'de',
    versions: [{ id: 'de_schlachter', name: 'Schlachter' }],
  },
  {
    label: 'Português Portuguese',
    lang: 'pt',
    versions: [
      { id: 'pt_nvi', name: 'NVI' },
      { id: 'pt_aa', name: 'Almeida Revisada' },
      { id: 'pt_acf', name: 'Almeida Corrigida' },
    ],
  },
  {
    label: 'Русский Russian',
    lang: 'ru',
    versions: [{ id: 'ru_synodal', name: 'Синодальный' }],
  },
  {
    label: 'العربية Arabic',
    lang: 'ar',
    versions: [{ id: 'ar_svd', name: 'Arabic Bible' }],
  },
  {
    label: 'Ελληνικά Greek',
    lang: 'el',
    versions: [{ id: 'el_greek', name: 'Modern Greek' }],
  },
  {
    label: 'Tiếng Việt Vietnamese',
    lang: 'vi',
    versions: [{ id: 'vi_vietnamese', name: 'Tiếng Việt' }],
  },
  {
    label: 'Suomi Finnish',
    lang: 'fi',
    versions: [
      { id: 'fi_finnish', name: 'Finnish Bible' },
      { id: 'fi_pr', name: 'Pyhä Raamattu' },
    ],
  },
  {
    label: 'Română Romanian',
    lang: 'ro',
    versions: [{ id: 'ro_cornilescu', name: 'Cornilescu' }],
  },
  {
    label: 'Esperanto',
    lang: 'eo',
    versions: [{ id: 'eo_esperanto', name: 'Esperanto' }],
  },
]

/** All version IDs (flat) */
export const ALL_VERSIONS = VERSION_GROUPS.flatMap(g => g.versions)

/** Map version ID → language code */
export const VERSION_LANG_MAP: Record<string, LangCode> = Object.fromEntries(
  VERSION_GROUPS.flatMap(g => g.versions.map(v => [v.id, g.lang]))
) as Record<string, LangCode>

/** Chinese version IDs for UI language detection */
export const CHINESE_VERSION_IDS = new Set(['zh_cuv', 'zh_ncv'])

/** Chapter label templates per language */
export const CHAPTER_LABELS: Record<string, (ch: number) => string> = {
  zh: (ch) => `第 ${ch} 章`,
  ko: (ch) => `${ch}장`,
  es: (ch) => `Capítulo ${ch}`,
  fr: (ch) => `Chapitre ${ch}`,
  de: (ch) => `Kapitel ${ch}`,
  pt: (ch) => `Capítulo ${ch}`,
  ru: (ch) => `Глава ${ch}`,
  ar: (ch) => `الإصحاح ${ch}`,
  el: (ch) => `Κεφάλαιο ${ch}`,
  vi: (ch) => `Chương ${ch}`,
  fi: (ch) => `Luku ${ch}`,
  ro: (ch) => `Capitolul ${ch}`,
  eo: (ch) => `Ĉapitro ${ch}`,
  en: (ch) => `Ch. ${ch}`,
}

/** OT/NT group labels per language */
export const OT_LABELS: Record<string, string> = {
  zh: '旧约', ko: '구약', es: 'Antiguo Testamento', fr: 'Ancien Testament',
  de: 'Altes Testament', pt: 'Antigo Testamento', ru: 'Ветхий Завет',
  ar: 'العهد القديم', el: 'Παλαιά Διαθήκη', vi: 'Cựu Ước',
  fi: 'Vanha testamentti', ro: 'Vechiul Testament', eo: 'Malnova Testamento',
  en: 'Old Testament',
}

export const NT_LABELS: Record<string, string> = {
  zh: '新约', ko: '신약', es: 'Nuevo Testamento', fr: 'Nouveau Testament',
  de: 'Neues Testament', pt: 'Novo Testamento', ru: 'Новый Завет',
  ar: 'العهد الجديد', el: 'Καινή Διαθήκη', vi: 'Tân Ước',
  fi: 'Uusi testamentti', ro: 'Noul Testament', eo: 'Nova Testamento',
  en: 'New Testament',
}
