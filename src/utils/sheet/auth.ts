import { google } from "googleapis";

export const authSheets = new google.auth.GoogleAuth({
    keyFile: "service-account-key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
export const sheetsClient = google.sheets({ version: "v4", auth: authSheets });
