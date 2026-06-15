import { z } from 'zod'

export const bookIdSchema = z
  .string()
  .trim()
  .min(1, '書籍IDを入力してください。')

export const bookSchema = z.object({
  id: bookIdSchema,
  title: z.string().trim().min(1, '書籍名を入力してください。'),
  isbn: z.string(),
  author: z.string().trim().min(1, '著者名を入力してください。'),
  publisher: z.string().trim().min(1, '出版社を入力してください。'),
  publishedAt: z.string(),
  majorCategory: z.string(),
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
