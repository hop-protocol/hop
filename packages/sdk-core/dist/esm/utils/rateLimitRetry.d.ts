export declare function rateLimitRetry<FN extends (...args: any[]) => Promise<any>>(fn: FN): (...args: Parameters<FN>) => Promise<Awaited<ReturnType<FN>>>;
//# sourceMappingURL=rateLimitRetry.d.ts.map