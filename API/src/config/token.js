import { env } from "./env.js";
import { z } from "zod"

const jwtSchema = z.object({
  secret: z.string(),
  expiresIn: z.string()
})

const { secret, expiresIn } = jwtSchema.parse({ secret: env.JWTSECRET, expiresIn: "1d" })

export const jwtConfig = { secret, expiresIn }