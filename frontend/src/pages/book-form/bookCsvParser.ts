import Papa from 'papaparse'
import { bookSchema } from '../../schemas/bookSchema'
import type { Book } from '../../types'
import {
  BOOK_CSV_COLUMN,
  BOOK_CSV_COLUMN_COUNT,
  COLLECTION_STATUS_BY_CODE,
  LOCATION_BY_CODE,
  MAJOR_CATEGORY_BY_CODE,
} from './bookCsvConstants'

export type BookCsvError = {
  rowNumber: number
  message: string
}

export type BookCsvParseResult = {
  books: Book[]
  errors: BookCsvError[]
}

const requiredColumns = [
  { index: BOOK_CSV_COLUMN.title, label: '書籍名' },
  { index: BOOK_CSV_COLUMN.author, label: '著者名' },
  { index: BOOK_CSV_COLUMN.collectionStatus, label: '配架分類' },
  { index: BOOK_CSV_COLUMN.publisher, label: '出版社' },
  { index: BOOK_CSV_COLUMN.location, label: '拠点' },
  { index: BOOK_CSV_COLUMN.shelfNumber, label: '棚番号' },
] as const

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  )
}

function createBookIds(existingBookIds: string[], count: number) {
  const maxBookNumber = existingBookIds.reduce((currentMax, id) => {
    const match = /^B(\d+)$/.exec(id)
    return match ? Math.max(currentMax, Number(match[1])) : currentMax
  }, 0)

  return Array.from({ length: count }, (_, index) => (
    `B${String(maxBookNumber + index + 1).padStart(4, '0')}`
  ))
}

async function readUtf8Csv(file: File) {
  const buffer = await file.arrayBuffer()
  return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
}

export async function parseBookCsv(
  file: File,
  existingBookIds: string[],
  minorCategoryMaster: string[],
): Promise<BookCsvParseResult> {
  const csvText = await readUtf8Csv(file)
  const parsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: 'greedy',
  })
  const errors: BookCsvError[] = []
  const formatErrorRows = new Set<number>()

  parsed.errors.forEach((error) => {
    const rowNumber = (error.row ?? 0) + 1
    formatErrorRows.add(rowNumber)
    errors.push({
      rowNumber,
      message: 'CSVフォーマットが不正です。',
    })
  })

  if (parsed.data.length === 0) {
    return {
      books: [],
      errors: [{ rowNumber: 1, message: 'CSVフォーマットが不正です。' }],
    }
  }

  const validRows: Array<{
    rowNumber: number
    book: Omit<Book, 'id'>
  }> = []

  parsed.data.forEach((rawColumns, index) => {
    const rowNumber = index + 1
    const columns = rawColumns.map((value, columnIndex) => (
      columnIndex === 0
        ? value.replace(/^\uFEFF/, '').trim()
        : value.trim()
    ))

    if (columns.length !== BOOK_CSV_COLUMN_COUNT) {
      if (!formatErrorRows.has(rowNumber)) {
        errors.push({
          rowNumber,
          message: 'CSVフォーマットが不正です。',
        })
      }
      return
    }

    let hasRowError = false
    requiredColumns.forEach(({ index: columnIndex, label }) => {
      if (!columns[columnIndex]) {
        hasRowError = true
        errors.push({
          rowNumber,
          message: `${label}は必須項目です。`,
        })
      }
    })

    const collectionStatusCode = columns[BOOK_CSV_COLUMN.collectionStatus]
    const collectionStatus = COLLECTION_STATUS_BY_CODE[collectionStatusCode]
    if (collectionStatusCode && !collectionStatus) {
      hasRowError = true
      errors.push({
        rowNumber,
        message: '配架分類は0、1または2を指定してください。',
      })
    }

    const locationCode = columns[BOOK_CSV_COLUMN.location]
    const location = LOCATION_BY_CODE[locationCode]
    if (locationCode && !location) {
      hasRowError = true
      errors.push({
        rowNumber,
        message: '拠点が存在しません。',
      })
    }

    const majorCategoryCode = columns[BOOK_CSV_COLUMN.majorCategory]
    const majorCategory = MAJOR_CATEGORY_BY_CODE[majorCategoryCode]
    if (majorCategoryCode && !majorCategory) {
      hasRowError = true
      errors.push({
        rowNumber,
        message: `大分類「${majorCategoryCode}」は存在しません。`,
      })
    }

    const publishedAt = columns[BOOK_CSV_COLUMN.publishedAt]
    if (publishedAt && !isValidDate(publishedAt)) {
      hasRowError = true
      errors.push({
        rowNumber,
        message: '出版日の形式が不正です。',
      })
    }

    const tierNumber = columns[BOOK_CSV_COLUMN.tierNumber]
    if (tierNumber && !/^-?\d+$/.test(tierNumber)) {
      hasRowError = true
      errors.push({
        rowNumber,
        message: '段番号は数値で入力してください。',
      })
    }

    if (hasRowError || !collectionStatus || !location) return

    const minorCategoryCode = columns[BOOK_CSV_COLUMN.minorCategory]
    const minorCategory = /^\d+$/.test(minorCategoryCode)
      ? (minorCategoryMaster[Number(minorCategoryCode)] ?? '')
      : ''
    const candidate = {
      title: columns[BOOK_CSV_COLUMN.title],
      isbn: columns[BOOK_CSV_COLUMN.isbn],
      author: columns[BOOK_CSV_COLUMN.author],
      collectionStatus,
      publisher: columns[BOOK_CSV_COLUMN.publisher],
      publishedAt,
      notes: columns[BOOK_CSV_COLUMN.notes],
      majorCategory: majorCategory ?? '',
      minorCategory,
      location,
      shelfNumber: columns[BOOK_CSV_COLUMN.shelfNumber],
      tierNumber,
    }

    validRows.push({ rowNumber, book: candidate })
  })

  if (errors.length > 0) {
    return { books: [], errors }
  }

  const bookIds = createBookIds(existingBookIds, validRows.length)
  const books: Book[] = []
  validRows.forEach(({ rowNumber, book }, index) => {
    const result = bookSchema.safeParse({ ...book, id: bookIds[index] })
    if (result.success) {
      books.push(result.data)
      return
    }

    errors.push({
      rowNumber,
      message: 'CSVフォーマットが不正です。',
    })
  })

  return errors.length > 0
    ? { books: [], errors }
    : { books, errors: [] }
}
