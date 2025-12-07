import env from "#config/env/env.js";
import { z } from "zod";
import { ConnectionOptions } from "bullmq";

const connectionSchema = z.object({
    host: z.string(),
    port: z.number(),
});

const NODE_ENV = env.NODE_ENV ?? "development";
const bullMQConfig: Record<typeof NODE_ENV, { connection: ConnectionOptions }> = {
    "development": {
        connection: connectionSchema.parse({
            host: env.REDIS_HOST ?? "localhost",
            port: env.REDIS_PORT ?? 6379,
        }),
    },

    "production": {
        connection: connectionSchema.parse({
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
        }),
    },
};

export default bullMQConfig[NODE_ENV];
