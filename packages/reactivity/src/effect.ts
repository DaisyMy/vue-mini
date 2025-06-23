/**
 * 收集依赖的方法
 * @param target
 * @param key
 */
export function track(
    target: object,
    key: unknown
) {
    console.log('@=>track:收集依赖', target, key)
}

/**
 * 触发依赖的方法
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(
    target: object,
    key?: unknown,
    newValue?: unknown
) {
    console.log('@=>trigger:触发依赖', target, key, newValue)
}

/**
 * effect 函数
 * @param fn
 */
export function effect<T = any>(fn: () => T) {
    // 创建 ReactiveEfect 实例
    const _effect = new ReactiveEffect(fn)
    // 执行run
    _effect.run()
}

/**
 * 当前 effect 实例
 */
export let activeEffect: ReactiveEffect | undefined

class ReactiveEffect<T = any> {
    constructor(
        public fn: () => T,
    ) {
    }

    run() {
        activeEffect = this
        return this.fn()
    }
}
