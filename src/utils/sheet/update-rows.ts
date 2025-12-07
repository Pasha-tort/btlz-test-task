import { sheetsClient } from "./auth.js";

/**
 * @param spreadsheetId
 * @param sheetName
 * @param sheetId
 * @param rangeLiteral
 * @param startIndex 0-based index
 * @param endIndex 0-based index
 * @param values
 */
export async function updateRows(
    spreadsheetId: string,
    sheetName: string,
    sheetId: number,
    rangeLiteral: [string, string],
    startIndex: number,
    endIndex: number,
    values: string[][],
) {
    // Делаем отступ для новых строк
    await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    insertDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex: endIndex,
                            endIndex: endIndex + values.length,
                        },
                        inheritFromBefore: false,
                    },
                },
            ],
        },
    });

    // Апдейтим сущ-ие строки, добавляя их ниже сущ-их
    await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!${rangeLiteral[0]}${endIndex + 1}:${rangeLiteral[1]}${endIndex + 1 + values.length}`,
        valueInputOption: "RAW",
        requestBody: { values },
    });

    // Удаляем сущ-ие строки, что бы внизу остались только актуальные
    await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex,
                            endIndex: endIndex + 1, //!! It is important to add 1
                        },
                    },
                },
            ],
        },
    });
}
