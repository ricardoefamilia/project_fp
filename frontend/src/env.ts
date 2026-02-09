import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(), // Full URL like 'http://localhost:3000/api'
  VITE_ENV: z.enum(['dev', 'prod']).optional().default('dev'),
})

export const env = envSchema.parse(import.meta.env)
