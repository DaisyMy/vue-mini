import {createDep, Dep} from './dep'
import {activeEffect, trackEffects, triggerEffects} from "./effect";
import {toReactive} from './reactive'
import {hasChanged} from '@vue/shared'


export interface Ref<T = any> {
    value: T
}

/**
 * ref函数
 * @param value
 */
export function ref(value?: unknown) {
    return createRef(value, false)
}

/**
 * 创建RefImpl实例
 * @param rawValue  原始数据
 * @param shallow   形数据，表示浅层响应式
 */
export function createRef(rawValue: unknown, shallow: boolean) {
    if (isRef(rawValue)) {
        return rawValue
    }
    return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
    private _value: T
    private _rawValue: T
    public dep?: Dep = undefined

    // 是否为 ref 类型标记
    public readonly __v_isRef = true

    constructor(value: T, public readonly __v_isShallow: boolean) {
        this._value = __v_isShallow ? value : toReactive(value)
        this._rawValue = value
    }

    /**
     * xxx.value 时触发
     */
    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newVal) {
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal
            this._value = toReactive(newVal)
            triggerRefValue(this)
        }
    }
}

/**
 * 执行 ref 的依赖
 * @param ref
 */
export function triggerRefValue(ref) {
    if (ref.dep) {
        triggerEffects(ref.dep)
    }
}

/**
 * 为 ref 的 value 进行依赖收集
 * @param ref
 */
export function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(ref.dep || (ref.dep = createDep()))
    }
}

/**
 * 判断数据是否是 RefImpl 类型
 * @param r
 */
export function isRef(r): r is Ref {
    return !!(r && r.__v_isRef === true)
}