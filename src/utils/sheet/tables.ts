export const tables = {
    tariffs: {
        rangeLiteral: ["A", "O"] as [string, string],
        eqColumn: 3,
        columns: [
            "date",
            "date_next_box",
            "date_till_max",
            "tariff_id",
            "warehouse_name",
            "geo_name",
            "box_delivery_base",
            "box_delivery_coef_expr",
            "box_delivery_liter",
            "box_delivery_marketplace_base",
            "box_delivery_marketplace_coef_expr",
            "box_delivery_marketplace_liter",
            "box_storage_base",
            "box_storage_coef_expr",
            "box_storage_liter",
        ],
    },
};
