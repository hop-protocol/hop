export function getUrlFromProvider(provider) {
    const rpcUrl = provider?.connection?.url ?? provider.providers?.[0]?.connection?.url ?? '';
    return rpcUrl;
}
//# sourceMappingURL=getUrlFromProvider.js.map