export function encodeObjectToBase64(obj: object): string {
    const jsonString = JSON.stringify(obj);
    const base64String = Buffer.from(jsonString).toString('base64');
    return base64String;
}

export function decodeBase64ToObject(base64String: string): object {
    const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
    const obj = JSON.parse(jsonString);
    return obj;
}