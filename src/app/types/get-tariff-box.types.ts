export interface IWarehouseItem {
    boxDeliveryBase: string;
    boxDeliveryCoefExpr: string;
    boxDeliveryLiter: string;
    boxDeliveryMarketplaceBase: string;
    boxDeliveryMarketplaceCoefExpr: string;
    boxDeliveryMarketplaceLiter: string;
    boxStorageBase: string;
    boxStorageCoefExpr: string;
    boxStorageLiter: string;
    geoName: string;
    warehouseName: string;
}

export interface ITariffsBox {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: IWarehouseItem[];
}

export interface IGetTariffsBoxResponse {
    response: {
        data: ITariffsBox;
    };
}

export interface ITariffData {
    id: string;
    date: string;
    dateNextBox: string | null;
    dateTillMax: string | null;
    warehouses: {
        warehouse_id: string;
        box_delivery_base: string;
        box_delivery_coef_expr: string;
        box_delivery_liter: string;
        box_delivery_marketplace_base: string;
        box_delivery_marketplace_coef_expr: string;
        box_delivery_marketplace_liter: string;
        box_storage_base: string;
        box_storage_coef_expr: string;
        box_storage_liter: string;
        geo_name: string | null;
        warehouse_name: string;
    }[];
}
