"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64ToObject = exports.encodeObjectToBase64 = void 0;
function encodeObjectToBase64(obj) {
    const jsonString = JSON.stringify(obj);
    const base64String = Buffer.from(jsonString).toString('base64');
    return base64String;
}
exports.encodeObjectToBase64 = encodeObjectToBase64;
function decodeBase64ToObject(base64String) {
    const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
    const obj = JSON.parse(jsonString);
    return obj;
}
exports.decodeBase64ToObject = decodeBase64ToObject;
