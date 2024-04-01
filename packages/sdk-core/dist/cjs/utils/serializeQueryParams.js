"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeQueryParams = void 0;
const serializeQueryParams = (params, options = {
    omitFalsy: false
}) => {
    const query = [];
    if (params instanceof Object) {
        for (const k in params) {
            const value = params[k];
            const keyName = k;
            if (options.omitFalsy && !value) {
                continue;
            }
            query.push([keyName, value].join('='));
        }
    }
    return query.join('&');
};
exports.serializeQueryParams = serializeQueryParams;
//# sourceMappingURL=serializeQueryParams.js.map