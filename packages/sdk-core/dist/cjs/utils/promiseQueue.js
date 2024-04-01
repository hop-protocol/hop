"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseQueue = void 0;
const p_queue_1 = __importDefault(require("p-queue"));
async function promiseQueue(items, cb, options) {
    const { concurrency } = options;
    const queue = new p_queue_1.default({ concurrency });
    for (let i = 0; i < items.length; i++) {
        queue.add(async () => cb(items[i], i));
    }
    await queue.onEmpty();
    await queue.onIdle();
}
exports.promiseQueue = promiseQueue;
//# sourceMappingURL=promiseQueue.js.map