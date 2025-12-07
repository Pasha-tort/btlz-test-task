import { Worker } from "bullmq";
import bullMQConfig from "#config/bullMQ/index.js";
import { JOB_NAME_GET_TARIFF_BOX, QUEUE_GET_TARIFF_BOX } from "#app/constants/queues.js";
import { GetTariffBoxStepEnum, GetTariffBoxWorkflow } from "#app/workflows/get-tariff-box/workflow.js";

export function startWorkerForGetTariffBox() {
    const getTariffBoxWorker = new Worker(
        QUEUE_GET_TARIFF_BOX,
        async (job) => {
            if (job.name === JOB_NAME_GET_TARIFF_BOX) {
                if (typeof job.progress === "object") return;
                /**
                 * Получаем текущее значение прогресса джобы и создаем воркфлоу из текущего стейта и далле для этого стейта запускаем выполнение То-есть если у
                 * нас придет задача которая находится в стейте "saveDB", значит мы получили данные и сохранили их в базу нам остается только прочитать данные с
                 * базы и запушить их в гугл таблицы, делать запрос на api WB уже не надо.
                 */
                const workflow = new GetTariffBoxWorkflow((job.progress as GetTariffBoxStepEnum) || GetTariffBoxStepEnum.PENDING);
                await workflow.getState().handle(job);
            }
        },
        {
            connection: bullMQConfig.connection,
        },
    );

    getTariffBoxWorker.on("completed", (job) => {
        console.log(`Job completed: ${job.id}`);
    });

    getTariffBoxWorker.on("failed", async (job, err) => {
        console.error(`Job failed: ${job?.id}`, err);
    });
}
