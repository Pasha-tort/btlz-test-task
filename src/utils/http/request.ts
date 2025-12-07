/**
 * Универсальный HTTP-запрос через fetch
 *
 * @param {string} url - Адрес запроса
 * @param {object} options - Настройки fetch (method, headers, body и т.п.)
 * @param {number} timeoutMs - Время ожидания ответа
 */
export async function httpRequest<T>(url: string, method: string = "GET", options: RequestInit = {}, timeoutMs: number = 10_000): Promise<T | string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            method,
            signal: controller.signal,
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}\n${text}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        return response.text();
    } catch (err) {
        const error = err as Error;
        if (error.name === "AbortError") {
            throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw new Error(`Request failed: ${error.message}`);
    } finally {
        clearTimeout(timeout);
    }
}
