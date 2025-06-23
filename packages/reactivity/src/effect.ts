type KeyToDepMap = Map<any, ReactiveEffect>

/**
 * 收集所有依赖的 WeakMap 实例
 * {key, value: {
 *     key,value
 * }}
 */
const targetMap = new WeakMap<any, KeyToDepMap>

/**
 * 当前 effect 实例
 */
export let activeEffect: ReactiveEffect | undefined

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
    // 判断 effect 实例是否存在
    if (!activeEffect) return
    // targetMap中获取 map
    let depsMap = targetMap.get(target)
    // 如果不存在 生成新map 并赋值
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    // 为map 设置回调（effect 实例）
    depsMap.set(key, activeEffect)
    console.log('@=>track:targetMap', targetMap)
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

    const depsMap = targetMap.get(target)
    if (!depsMap) return
    const effect = depsMap.get(key) as ReactiveEffect
    if(!effect) return
    // 执行 effect 中的 fn
    effect.fn()
}

/**
 * effect 函数
 * @param fn
 */
export function effect<T = any>(fn: () => T) {
    // 创建 ReactiveEffect (activeEffect) 实例
    const _effect = new ReactiveEffect(fn)
    // 执行 run => fn()
    _effect.run()
}


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
