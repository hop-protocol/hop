"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
function isValidUrl(url) {
    let _url;
    try {
        _url = new URL(url);
    }
    catch (err) {
        return false;
    }
    return _url.protocol === 'http:' || _url.protocol === 'https:';
}
exports.isValidUrl = isValidUrl;
//# sourceMappingURL=isValidUrl.js.map