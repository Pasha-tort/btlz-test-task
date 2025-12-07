import { WorkflowsStepBase } from "#libs/workflows/workflows-step-base.js";
import { httpRequest } from "#utils/http/index.js";
import env from "#config/env/env.js";
import { IGetTariffsBoxResponse, ITariffData, ITariffsBox } from "#app/types/get-tariff-box.types.js";
import { getTariffsWithWarehouses, insertTariffsAndWarehouse } from "#app/repositories/tariffs.repository.js";
import { GetTariffBoxStepEnum } from "./workflow.js";
import { Job } from "bullmq";
import { DateToYYYYMMDD, getYearFromDate } from "#utils/date/index.js";
import { writeToSheet } from "#utils/sheet/write-to-sheet.js";
import { tables } from "#utils/sheet/tables.js";
import { queueControl } from "./queue-control.js";

export class GetTariffBoxPendingStep extends WorkflowsStepBase {
    public async handle(job: Job) {
        const date = new Date().toISOString().split("T")[0];
        // если были бы очень большие данные, то надо было тащить данные через стрим, но аднных не так много, стрим излишен здесь
        const response = await httpRequest<IGetTariffsBoxResponse>(`${env.ENDPOINT_TARIFF}?date=${date}`, "GET", {
            headers: { "Authorization": env.API_KEY_WB },
        }).catch((err) => {
            console.error(err);
            throw new Error(err);
        });
        if (!response || typeof response === "string") return;
        const tariffs = response.response.data as ITariffsBox;
        await insertTariffsAndWarehouse({ ...tariffs, date });
        const state = this.workflow?.setState(GetTariffBoxStepEnum.SAVE_DB);
        await job.updateProgress(GetTariffBoxStepEnum.SAVE_DB);
        await state?.handle(job);
    }
}

export class GetTariffBoxSaveDBStep extends WorkflowsStepBase {
    public async handle(job: Job) {
        const dateNow = new Date();
        const date = DateToYYYYMMDD(dateNow);
        const year = getYearFromDate(dateNow);
        const [tariffsNowDate] = await getTariffsWithWarehouses(date);
        // здесь необходим промис, что бы метод ждал окончания промиса, ведь если writeToSheet закончится не удачей, нам нельзя обновлять стейт
        // Да не очень красиво видеть тут в логике такой большой кусок кода с промисом,
        // но не успел я его как то красивее обернуть
        if (!tariffsNowDate) throw new Error("Tariff not found");
        await new Promise((res, rej) => {
            queueControl.push(async () => {
                await writeToSheet(
                    this.tariffToSheetRows(tariffsNowDate || []),
                    env.SPREADSHEET_ID,
                    year,
                    tables.tariffs.rangeLiteral,
                    tables.tariffs.eqColumn,
                    tariffsNowDate.id,
                )
                    .then(async () => {
                        const state = this.workflow?.setState(GetTariffBoxStepEnum.SEND_TO_SHEET);
                        await job.updateProgress(GetTariffBoxStepEnum.SEND_TO_SHEET);
                        await state?.handle(job);
                        res("");
                    })
                    .catch(() => rej());
            });
        }).catch((err) => {
            console.error(err);
            throw new Error("Error when writing to the sheet");
        });
    }

    private tariffToSheetRows(tariff: ITariffData) {
        return tariff.warehouses.map((w) => [
            tariff.date,
            tariff.dateNextBox ?? "",
            tariff.dateTillMax ?? "",
            tariff.id,
            w.warehouse_name,
            w.geo_name || "",
            w.box_delivery_base,
            w.box_delivery_coef_expr,
            w.box_delivery_liter,
            w.box_delivery_marketplace_base,
            w.box_delivery_marketplace_coef_expr,
            w.box_delivery_marketplace_liter,
            w.box_storage_base,
            w.box_storage_coef_expr,
            w.box_storage_liter,
        ]);
    }
}

export class GetTariffBoxSendToSheet extends WorkflowsStepBase {
    public async handle(job: Job) {
        console.log("Workflow completed");
        await job.updateProgress(GetTariffBoxStepEnum.PENDING); //!! returned the job progress to the initial position
    }
}

export class GetTariffBoxUnknownStep extends WorkflowsStepBase {
    public handle() {
        console.error("It is not possible to perform the action");
        return;
    }
}
