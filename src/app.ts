import { startListenTariffBox } from "#app/jobs/get-tariff-box.job.js";
import { migrate, seed } from "#postgres/knex.js";

await migrate?.latest();
//Сидов у меня нет
// await seed?.run();

console.log("All migrations and seeds have been run");

startListenTariffBox();
