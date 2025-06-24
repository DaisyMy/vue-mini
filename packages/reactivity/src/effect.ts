import {Dep, createDep} from './dep'

type KeyToDepMap = Map<any, Dep>

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

    let dep = depsMap.get(key)
    if (!dep) {
        dep = createDep()
        depsMap.set(key, dep)
    }
    console.log('@=>track:targetMap', targetMap)
    trackEffects(dep)
}

/**
 * dep 添加 activeEffect
 * @param dep
 */
export function trackEffects(dep: Dep) {
    dep.add(activeEffect!)
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
    const dep = depsMap.get(key)
    if (!dep) return;
    triggerEffects(dep)
}
// 依次触发依赖
export function triggerEffects(dep: Dep) {
    const effects = Array.isArray(dep) ? dep : [...dep]
    for (const effect of effects) {
        triggerEffect(effect)
    }
}
// 触发指定依赖
export function triggerEffect(effect: ReactiveEffect) {
    effect.run()
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


export class ReactiveEffect<T = any> {
    constructor(
        public fn: () => T,
    ) {
    }

    run() {
        activeEffect = this
        return this.fn()
    }
}
