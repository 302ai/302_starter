import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError, z } from "zod";

// Define and validate the environment variables
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    API_KEY: z.string().optional(),
    NEXTAUTH_SECRET: z.string().min(32).optional(),
  },
  client: {
    NEXT_PUBLIC_LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]),
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL: z.string().url(),
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_API_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_PATH: z.string().startsWith("/"),
    NEXT_PUBLIC_IS_CHINA: z.boolean(),
    NEXT_PUBLIC_DEFAULT_LOCALE: z.string(),
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: z.string(),
    NEXT_PUBLIC_DEV_HOST_NAME: z.string().optional(),
    NEXT_PUBLIC_HIDE_BRAND: z.boolean().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY: process.env.API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL,
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_CHINA,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    NEXT_PUBLIC_AUTH_PATH: process.env.NEXT_PUBLIC_AUTH_PATH,
    NEXT_PUBLIC_IS_CHINA: process.env.NEXT_PUBLIC_IS_CHINA === "true",
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: process.env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
    NEXT_PUBLIC_DEV_HOST_NAME: process.env.NEXT_PUBLIC_DEV_HOST_NAME,
    NEXT_PUBLIC_HIDE_BRAND: process.env.NEXT_PUBLIC_HIDE_BRAND === "true",
  },
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    process.exit(1);
  },
  emptyStringAsUndefined: true,
});
