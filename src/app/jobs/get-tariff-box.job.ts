import { JOB_NAME_GET_TARIFF_BOX } from "#app/constants/queues.js";
import { startWorkerForGetTariffBox } from "#app/workers/get-tariff-box.worker.js";
import env from "#config/env/env.js";
import { getTariffBoxQueue } from "../queues/get-tariff-box.queue.js";

export function startListenTariffBox() {
    getTariffBoxQueue.upsertJobScheduler(
        "getTariffBox-id",
        { pattern: env.CRON_PATTERN },
        {
            name: JOB_NAME_GET_TARIFF_BOX,
            data: {},
            "opts": {
                attempts: 5,
                backoff: 10000,
            },
        },
    );
    startWorkerForGetTariffBox();
}
