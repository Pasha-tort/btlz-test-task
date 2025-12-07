import { sheetsClient } from "./auth.js";
import { createRows } from "./create-rows.js";
import { searchIndexesRows } from "./get-rows.js";
import { getSheetId } from "./get-sheet-id.js";
import { createColumnForTariffTable } from "./tarrifs/tariffs-table.js";
import { updateRows } from "./update-rows.js";
/**
 * @param values
 * @param spreadsheetId
 * @param sheetName
 * @param rangeLiteral
 * @param eqColumn
 * @param eqValue
 * @param startIndex 0-based index
 */
export async function writeToSheet(
    values: string[][],
    spreadsheetId: string,
    sheetName: string,
    rangeLiteral: [string, string],
    eqColumn: number,
    eqValue: string,
    startIndex = 2,
) {
    const {
        data: { sheets: existingSheets },
    } = await sheetsClient.spreadsheets
        .get({
            spreadsheetId,
            fields: "sheets(properties(title))",
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });

    const sheetExists = existingSheets?.some((sheet) => sheet.properties?.title === sheetName);

    if (!sheetExists) {
        await createColumnForTariffTable(spreadsheetId, sheetName);
    }

    const sheetId = await getSheetId(spreadsheetId, sheetName);

    // ищем индексы тех строк которые уже существуют и которые надо обновить
    const indexes = await searchIndexesRows(spreadsheetId, sheetName, rangeLiteral, eqColumn, eqValue);

    if (indexes?.startIndex && indexes.endIndex) {
        // Обновляем строки
        const { startIndex, endIndex } = indexes;
        await updateRows(spreadsheetId, sheetName, sheetId, rangeLiteral, startIndex - 1, endIndex - 1, values);
        // await sheetsClient.spreadsheets.batchUpdate({
        //     spreadsheetId: spreadsheetId,
        //     requestBody: {
        //         requests: [
        //             {
        //                 insertDimension: {
        //                     range: {
        //                         sheetId,
        //                         dimension: "ROWS",
        //                         startIndex: indexFinish + 1,
        //                         endIndex: indexFinish + 1 + values.length,
        //                     },
        //                     inheritFromBefore: false,
        //                 },
        //             },
        //         ],
        //     },
        // });

        // // Апдейтим сущ-ие строки, добавляя их ниже сущ-их
        // await sheetsClient.spreadsheets.values.update({
        //     spreadsheetId,
        //     range: `${sheetName}!${rangeLiteral[0]}${indexFinish + 1}:${rangeLiteral[1]}${indexFinish + 1 + values.length}`,
        //     valueInputOption: "RAW",
        //     requestBody: { values },
        // });

        // // Удаляем сущ-ие строки, что бы внизу остались только актуальные
        // await sheetsClient.spreadsheets.batchUpdate({
        //     spreadsheetId: spreadsheetId,
        //     requestBody: {
        //         requests: [
        //             {
        //                 deleteDimension: {
        //                     range: {
        //                         sheetId,
        //                         dimension: "ROWS",
        //                         startIndex: indexStart,
        //                         endIndex: indexFinish + 1,
        //                     },
        //                 },
        //             },
        //         ],
        //     },
        // });
    } else {
        // Создаем строки
        await createRows(spreadsheetId, sheetName, sheetId, rangeLiteral, startIndex, values);
        // await sheetsClient.spreadsheets.batchUpdate({
        //     spreadsheetId: spreadsheetId,
        //     requestBody: {
        //         requests: [
        //             {
        //                 insertDimension: {
        //                     range: {
        //                         sheetId,
        //                         dimension: "ROWS",
        //                         startIndex: startIndex,
        //                         endIndex: startIndex + 1 + values.length,
        //                     },
        //                     inheritFromBefore: false,
        //                 },
        //             },
        //         ],
        //     },
        // });
        // await sheetsClient.spreadsheets.values.update({
        //     spreadsheetId,
        //     range: `${sheetName}!${rangeLiteral[0]}${startIndex}:${rangeLiteral[1]}${startIndex + values.length}`,
        //     valueInputOption: "RAW",
        //     requestBody: { values },
        // });
    }
}
