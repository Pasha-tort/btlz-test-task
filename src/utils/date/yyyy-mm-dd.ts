export function DateToYYYYMMDD(date: Date): string {
    return date.toISOString().split("T")[0];
}
