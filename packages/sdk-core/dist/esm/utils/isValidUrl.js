export function isValidUrl(url) {
    let _url;
    try {
        _url = new URL(url);
    }
    catch (err) {
        return false;
    }
    return _url.protocol === 'http:' || _url.protocol === 'https:';
}
//# sourceMappingURL=isValidUrl.js.map