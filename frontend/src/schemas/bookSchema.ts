import { z } from 'zod'

export const bookIdSchema = z
  .string()
  .trim()
  .min(1, '書籍IDを入力してください。')

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

export const bookSchema = z.object({
  id: bookIdSchema,
  title: z.string().trim().min(1, '書籍名を入力してください。'),
  isbn: z.string(),
  author: z.string().trim().min(1, '著者名を入力してください。'),
  publisher: z.string().trim().min(1, '出版社を入力してください。'),
  publishedAt: z.string().refine(
    (value) => !value || isValidDate(value),
    '出版日はYYYY-MM-DD形式で入力してください。',
  ),
  majorCategory: z.string().trim().min(1, '大分類を入力してください。'),
  minorCategory: z.string(),
  collectionStatus: z.enum(['開架', '閉架', '廃棄']),
  location: z.enum(['東京', '大阪']),
  shelfNumber: z.string().trim().min(1, '棚番号を入力してください。'),
  tierNumber: z.string(),
  notes: z.string(),
})

export type BookValidationErrors = Partial<
  Record<keyof z.infer<typeof bookSchema>, string>
>
