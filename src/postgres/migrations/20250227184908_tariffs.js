/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("tariffs", (table) => {
        table.uuid("id").primary();
        table.string("date").unique().notNullable();
        table.string("date_next_box").nullable();
        table.string("date_till_max").nullable();
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTable("tariffs");
}
