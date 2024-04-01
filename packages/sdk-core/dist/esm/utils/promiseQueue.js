import PQueue from 'p-queue';
export async function promiseQueue(items, cb, options) {
    const { concurrency } = options;
    const queue = new PQueue({ concurrency });
    for (let i = 0; i < items.length; i++) {
        queue.add(async () => cb(items[i], i));
    }
    await queue.onEmpty();
    await queue.onIdle();
}
//# sourceMappingURL=promiseQueue.js.map