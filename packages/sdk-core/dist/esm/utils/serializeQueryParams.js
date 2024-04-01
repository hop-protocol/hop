export const serializeQueryParams = (params, options = {
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
//# sourceMappingURL=serializeQueryParams.js.map