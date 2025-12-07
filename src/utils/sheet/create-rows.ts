import { sheetsClient } from "./auth.js";

/**
 * @param spreadsheetId
 * @param sheetName
 * @param sheetId
 * @param rangeLiteral
 * @param startIndex 0-based index
 * @param values
 */
export async function createRows(
    spreadsheetId: string,
    sheetName: string,
    sheetId: number,
    rangeLiteral: [string, string],
    startIndex: number,
    values: string[][],
) {
    // Создаем новые строки, выше старых, что бы вверху были тарифы для более поздних дат
    await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    insertDimension: {
                        range: {
                            sheetId,
                            dimension: "ROWS",
                            startIndex,
                            endIndex: startIndex + 1 + values.length, //here's a plus 1 to keep the distance between the dates
                        },
                        inheritFromBefore: false,
                    },
                },
            ],
        },
    });
    await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!${rangeLiteral[0]}${startIndex + 1}:${rangeLiteral[1]}${startIndex + 1 + values.length}`,
        valueInputOption: "RAW",
        requestBody: { values },
    });
}
