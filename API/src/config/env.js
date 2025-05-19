import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  XLSX: z.string(),
  LOGERROR: z.string(),
  LOGIN: z.string(),
  GLPIINITIAL: z.string(),
  JWTSECRET: z.string()
})

export const env = envSchema.parse(process.env)