import { sheetsClient } from "./auth.js";

/**
 * @param sheetId
 * @param sheetName
 * @param rangeLiteral
 * @param eqColumn
 * @param eqValue
 * @param countStart 1-based index
 * @returns
 */
export async function searchIndexesRows(
    sheetId: string,
    sheetName: string,
    rangeLiteral: [string, string],
    eqColumn: number,
    eqValue: string,
    countStart: number = 3,
) {
    let isFetch = true;
    const batch = 1000;
    let countFinish = batch;
    const indexes: number[] = [];
    do {
        const result = await sheetsClient.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${sheetName}!${rangeLiteral[0]}${countStart}:${rangeLiteral[1]}${countStart + countFinish}`,
        });
        const indexesCut =
            result.data.values
                ?.map((row, i) => (row[eqColumn] === eqValue ? i : null))
                .filter((i) => i !== null)
                .map((i) => countStart + i!) || [];
        indexes.push(...indexesCut);
        countStart = countFinish;
        countFinish += batch;
        if (!result.data.values?.length || result.data.values?.length < batch) isFetch = false;
    } while (isFetch);
    indexes.sort((a, b) => a - b);
    if (!indexes.length) return null;
    return {
        startIndex: indexes[0],
        endIndex: indexes[indexes.length - 1],
        range: `!${rangeLiteral[0]}${indexes[0]}:${rangeLiteral[1]}${indexes[1]}`,
        indexes,
    };
}
