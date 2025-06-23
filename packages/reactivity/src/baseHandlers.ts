import {track, trigger} from './effect'

/**
 * get回调
 */
const get = createGetter()

function createGetter() {
    return function get(target: object, key: string | symbol, receiver: object) {
        // 通过Reflect 获取返回值
        const res = Reflect.get(target, key, receiver)
        // 收集依赖
        track(target, key)
        return res
    }
}

/**
 * set回调
 */
const set = createSetter()

function createSetter() {
    return function set(target: object, key: string | symbol, value: unknown, receiver: object) {
        const result = Reflect.set(target, key, value, receiver)
        // 触发依赖
        trigger(target, key)
        return result
    }
}

/**
 * 响应式的handler
 */
export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
}