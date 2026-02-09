import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
})

export type User = z.infer<typeof userSchema>
export const createUserSchema = userSchema.omit({ id: true, createdAt: true })
export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * Update user schema matching backend UpdateUserDto validation
 * Backend: name is optional, minLength: 2, maxLength: 100
 * Backend: image is optional, maxLength: 500
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  image: z
    .string()
    .max(500, 'URL da imagem deve ter no máximo 500 caracteres')
    .optional()
    .nullable(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
