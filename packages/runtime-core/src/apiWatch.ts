import {EMPTY_OBJECT, hasChanged, isObject} from '@vue/shared'
import {isReactive, ReactiveEffect} from '@vue/reactivity'
import {queuePreFlushCb} from './scheduler'

/**
 * options 类型
 */
export interface WatchOptions<immediate = boolean> {
    immediate?: immediate
    deep?: boolean
}

/**
 * watch 函数入口
 * @param source
 * @param cb
 * @param options
 */
export function watch(source: any, cb: Function, options: WatchOptions) {
    return doWatch(source as any, cb, options)
}

function doWatch(
    source: any,
    cb: Function,
    {immediate, deep}: WatchOptions = EMPTY_OBJECT
) {
    let getter: () => any

    if (isReactive(source)) {
        getter = () => source
        deep = true
    } else {
        getter = () => {
        }
    }

    if (cb && deep) {
        const baseGetter = getter
        getter = () => traverse(baseGetter())
    }

    let oldValue = {}

    const job = () => {
        if (cb) {
            const newValue = effect.run()
            if (deep || hasChanged(newValue, oldValue)) {
                cb(newValue, oldValue)
                oldValue = newValue
            }
        }
    }

    let scheduler = () => queuePreFlushCb(job)

    const effect = new ReactiveEffect(getter, scheduler)

    if (cb) {
        if (immediate) {
            job()
        } else {
            oldValue = effect.run()
        }
    } else {
        effect.run()
    }

    return () => {
        effect.stop()
    }
}

export function traverse(value: unknown) {
    if (!isObject(value)) {
        return value
    }

    for (let key in value as Object) {
        traverse((value as any)[key])
    }

    return value
}