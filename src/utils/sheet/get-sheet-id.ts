import { sheetsClient } from "./auth.js";

export async function getSheetId(spreadsheetId: string, sheetName: string) {
    const res = await sheetsClient.spreadsheets.get({ spreadsheetId });
    const sheet = res.data.sheets?.find((s) => s.properties?.title === sheetName);
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
    return sheet.properties?.sheetId!;
}
