import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  PAYMENT_API_KEY: z.string(),
  PAYMENT_API_URL: z.string().url(),
  UPLOADTHING_APP_ID: z.string(),
  UPLOADTHING_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development")
})

export const env = envSchema.parse(process.env)