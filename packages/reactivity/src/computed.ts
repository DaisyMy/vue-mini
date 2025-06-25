import {isFunction} from "@vue/shared";
import {Dep} from "./dep"
import {ReactiveEffect} from "./effect";
import {trackRefValue, triggerRefValue} from "./ref";

/**
 * 计算属性类
 */
export class ComputedRefImpl<T> {
    public dep?: Dep = undefined
    private _value!: T

    public readonly effect: ReactiveEffect<T>
    public readonly __v_isRef = true

    // 标识符
    public _dirty = true

    constructor(getter: () => T) {
        // 依赖  getter 依赖函数   ()=>{} 调度器
        this.effect = new ReactiveEffect(getter, () => {
            // 调度器实现响应式
            if (!this._dirty) {
                this._dirty = true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
    }

    get value() {
        trackRefValue(this)
        if (this._dirty) {
            this._dirty = false
            this._value = this.effect.run()
        }
        return this._value
    }
}

/**
 * computed 入口
 * @param getterOrOptions
 */
export function computed(getterOrOptions) {
    let getter
    const onlyGetter = isFunction(getterOrOptions)
    if (onlyGetter) {
        getter = getterOrOptions
    }

    const cRef = new ComputedRefImpl(getter)
    return cRef as any
}