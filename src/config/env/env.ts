import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),
    POSTGRES_HOST: z.union([z.undefined(), z.string()]),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),
    REDIS_HOST: z.union([z.undefined(), z.string()]),
    REDIS_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    // ENDPOINT_TARIFF: z.string().nonempty().url(),
    API_KEY_WB: z.string().nonempty(),
    // SPREADSHEET_ID: z.string().nonempty(),
    // CRON_PATTERN: z.string().nonempty(),
});

const env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    // ENDPOINT_TARIFF: process.env.ENDPOINT_TARIFF,
    API_KEY_WB: process.env.API_KEY_WB,
    // SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    // CRON_PATTERN: process.env.CRON_PATTERN,
});

export default env;
