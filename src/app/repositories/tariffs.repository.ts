import { ITariffData, ITariffsBox, IWarehouseItem } from "#app/types/get-tariff-box.types.js";
import knex from "#postgres/knex.js";
import { v4 as uuidv4 } from "uuid";

interface ITariffTable {
    id: string;
    date: string;
    date_next_box: string | null;
    date_till_max: string | null;
}

export async function insertTariffsAndWarehouse(data: ITariffsBox & { date: string }) {
    await knex.transaction(async (trx) => {
        let tariffId = uuidv4();
        const [existTariff] = await trx("tariffs as t").select("t.id").where("t.date", data.date);
        if (existTariff) tariffId = existTariff.id;
        await trx<ITariffTable>("tariffs")
            .insert({
                id: tariffId,
                date: data.date,
                date_next_box: data.dtNextBox || null,
                date_till_max: data.dtTillMax || null,
            })
            .onConflict("date")
            .merge({
                date_next_box: data.dtNextBox || null,
                date_till_max: data.dtTillMax || null,
            });

        const warehouseRecords = data.warehouseList.map((w) => ({
            id: uuidv4(),
            tariff_id: tariffId,
            box_delivery_base: w.boxDeliveryBase,
            box_delivery_coef_expr: w.boxDeliveryCoefExpr,
            box_delivery_liter: w.boxDeliveryLiter,
            box_delivery_marketplace_base: w.boxDeliveryMarketplaceBase,
            box_delivery_marketplace_coef_expr: w.boxDeliveryMarketplaceCoefExpr,
            box_delivery_marketplace_liter: w.boxDeliveryMarketplaceLiter,
            box_storage_base: w.boxStorageBase,
            box_storage_coef_expr: w.boxStorageCoefExpr,
            box_storage_liter: w.boxStorageLiter,
            geo_name: w.geoName || null,
            warehouse_name: w.warehouseName,
        }));

        if (warehouseRecords.length > 0) {
            await trx("tariffs_warehouse")
                .insert(warehouseRecords)
                .onConflict(["tariff_id", "warehouse_name"])
                .merge((w: IWarehouseItem) => ({
                    box_delivery_base: w.boxDeliveryBase,
                    box_delivery_coef_expr: w.boxDeliveryCoefExpr,
                    box_delivery_liter: w.boxDeliveryLiter,
                    box_delivery_marketplace_base: w.boxDeliveryMarketplaceBase,
                    box_delivery_marketplace_coef_expr: w.boxDeliveryMarketplaceCoefExpr,
                    box_delivery_marketplace_liter: w.boxDeliveryMarketplaceLiter,
                    box_storage_base: w.boxStorageBase,
                    box_storage_coef_expr: w.boxStorageCoefExpr,
                    box_storage_liter: w.boxStorageLiter,
                    geo_name: w.geoName || null,
                }));
        }
    });
}

export async function getTariffsWithWarehouses(date: string): Promise<ITariffData[]> {
    const rows = await knex("tariffs as t")
        .leftJoin("tariffs_warehouse as w", "w.tariff_id", "t.id")
        .select(
            "t.id",
            "t.date",
            "t.date_next_box",
            "t.date_till_max",
            "w.id as warehouse_id",
            "w.box_delivery_base",
            "w.box_delivery_coef_expr",
            "w.box_delivery_liter",
            "w.box_delivery_marketplace_base",
            "w.box_delivery_marketplace_coef_expr",
            "w.box_delivery_marketplace_liter",
            "w.box_storage_base",
            "w.box_storage_coef_expr",
            "w.box_storage_liter",
            "w.geo_name",
            "w.warehouse_name",
        )
        .where("t.date", date);

    const tariffsMap: Record<string, any> = {};
    rows.forEach((row) => {
        if (!tariffsMap[row.id]) {
            tariffsMap[row.id] = {
                id: row.id,
                date: row.date,
                dateNextBox: row.date_next_box,
                dateTillMax: row.date_till_max,
                warehouses: [],
            };
        }
        if (row.warehouse_id) {
            tariffsMap[row.id].warehouses.push({
                id: row.warehouse_id,
                box_delivery_base: row.box_delivery_base,
                box_delivery_coef_expr: row.box_delivery_coef_expr,
                box_delivery_liter: row.box_delivery_liter,
                box_delivery_marketplace_base: row.box_delivery_marketplace_base,
                box_delivery_marketplace_coef_expr: row.box_delivery_marketplace_coef_expr,
                box_delivery_marketplace_liter: row.box_delivery_marketplace_liter,
                box_storage_base: row.box_storage_base,
                box_storage_coef_expr: row.box_storage_coef_expr,
                box_storage_liter: row.box_storage_liter,
                geo_name: row.geo_name,
                warehouse_name: row.warehouse_name,
            });
        }
    });

    return Object.values(tariffsMap);
}
