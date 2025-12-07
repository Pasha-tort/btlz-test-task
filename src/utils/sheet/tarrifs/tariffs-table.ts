import { sheetsClient } from "../auth.js";
import { getSheetId } from "../get-sheet-id.js";
import { tables } from "../tables.js";

export async function createColumnForTariffTable(spreadsheetId: string, sheetName: string) {
    await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: sheetName,
                        },
                    },
                },
            ],
        },
    });
    console.warn(`List "${sheetName}" not found. Create new list.`);

    await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:Z1`, // диапазон под заголовки
        valueInputOption: "RAW",
        requestBody: {
            values: [tables.tariffs.columns],
        },
    });

    const sheetId = await getSheetId(spreadsheetId, sheetName);

    await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    repeatCell: {
                        range: {
                            sheetId,
                            startRowIndex: 0,
                            endRowIndex: 1,
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 }, // светло-серый
                                textFormat: { bold: true },
                            },
                        },
                        fields: "userEnteredFormat(backgroundColor,textFormat)",
                    },
                },
            ],
        },
    });
}
