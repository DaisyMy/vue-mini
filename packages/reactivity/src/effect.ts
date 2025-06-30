import {Dep, createDep} from './dep'
import {ComputedRefImpl} from "./computed";
import {extend} from "@vue/shared"

type KeyToDepMap = Map<any, Dep>
export type EffectScheduler = (...arg: any[]) => any
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
    // 解决死循环问题
    for (const effect of effects) {
        if (effect.computed) {
            triggerEffect(effect)
        }
    }
    for (const effect of effects) {
        if (!effect.computed) {
            triggerEffect(effect)
        }
    }
}

// 触发指定依赖
export function triggerEffect(effect: ReactiveEffect) {
    if (effect.scheduler) {
        // 处理 computed
        effect.scheduler()
    } else {
        effect.run()
    }
}

/**
 * effect 函数
 * @param fn
 */
export function effect<T = any>(fn: () => T, options) {
    // 创建 ReactiveEffect (activeEffect) 实例
    const _effect = new ReactiveEffect(fn)
    if (options) {
        extend(_effect, options)
    }
    if (!options && !options?.lazy) {
        // 执行 run => fn()
        _effect.run()
    }
}


export class ReactiveEffect<T = any> {

    computed?: ComputedRefImpl<T>

    /**
     * 创建类的实例。
     * @param  fn - 要执行的函数，该函数返回类型为 T 的值。
     * @param  scheduler - 负责管理 effect 执行的调度器。如果未提供，则默认为 null。
     */
    constructor(
        public fn: () => T,
        public scheduler: EffectScheduler | null = null
    ) {
    }

    run() {
        activeEffect = this
        return this.fn()
    }

    stop(){}
}
