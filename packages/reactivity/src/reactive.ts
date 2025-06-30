import {mutableHandlers} from "./baseHandlers";
import {isObject} from '@vue/shared'

/**
 * 响应式 Map 缓存对象
 * key: target
 * val: proxy
 */
export const reactiveMap = new WeakMap<object, any>();

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

/**
 * 创建响应式对象
 * @param target
 * @returns 代理对象
 */
export function reactive(target: object) {
    return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * 创建响应式对象
 * @param target 响应式对象
 * @param baseHandlers handler
 * @param proxyMap
 * @returns
 */
export function createReactiveObject(
    target: object,
    baseHandlers: ProxyHandler<any>,
    proxyMap: WeakMap<object, any>
) {
    // 是否被代理
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // 创建proxy实例
    const proxy = new Proxy(target, baseHandlers);
    proxy[ReactiveFlags.IS_REACTIVE] = true
    proxyMap.set(target, proxy);
    return proxy;
}

export function toReactive<T extends unknown>(val: T): T {
    return isObject(val) ? reactive(val as object) : val
}

export function isReactive(value: any): Boolean {
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}