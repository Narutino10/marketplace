export function encodeBase64(text: string): string {
    return btoa(text);
}

export function decodeBase64(base64: string): string {
    return atob(base64);
}
