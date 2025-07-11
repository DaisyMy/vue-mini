/**
 * 状态 pending
 */
let isFlushPending = false

const resolvePromise = Promise.resolve() as Promise<any>

let currentFlushPromise: Promise<void> | null = null

/**
 * 存储待执行的回调函数的数组
 */
const pendingPreFlushCbs: Function[] = []

export function queuePreFlushCb(cb: Function) {
    queueCb(cb, pendingPreFlushCbs)
}

function queueCb(cb: Function, pendingQueue: Function[]) {
    pendingQueue.push(cb)
    queueFlush()
}

function queueFlush() {
    if (!isFlushPending) {
        isFlushPending = true
        currentFlushPromise = resolvePromise.then(flushJobs)
    }
}

function flushJobs() {
    isFlushPending = false
    flushPreFlushCbs()
}

export function flushPreFlushCbs() {
    if (pendingPreFlushCbs.length) {
        let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
        pendingPreFlushCbs.length = 0
        for (let i = 0; i < activePreFlushCbs.length; i++) {
            activePreFlushCbs[i]()
        }
    }
}