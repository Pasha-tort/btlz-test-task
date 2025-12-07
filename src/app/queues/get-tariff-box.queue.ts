import { Queue } from "bullmq";
import bullMQConfig from "#config/bullMQ/index.js";
import { QUEUE_GET_TARIFF_BOX } from "#app/constants/queues.js";

export const getTariffBoxQueue = new Queue(QUEUE_GET_TARIFF_BOX, {
    connection: bullMQConfig.connection,
});
