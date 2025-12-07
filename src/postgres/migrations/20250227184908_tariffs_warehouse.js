/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("tariffs_warehouse", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("tariff_id").references("id").inTable("tariffs").onDelete("CASCADE").onUpdate("CASCADE");
        table.string("box_delivery_base");
        table.string("box_delivery_coef_expr");
        table.string("box_delivery_liter");
        table.string("box_delivery_marketplace_base");
        table.string("box_delivery_marketplace_coef_expr");
        table.string("box_delivery_marketplace_liter");
        table.string("box_storage_base");
        table.string("box_storage_coef_expr");
        table.string("box_storage_liter");
        table.string("geo_name").nullable();
        table.string("warehouse_name");
        table.unique(["tariff_id", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTable("tariffs_warehouse");
}
