import {isArray, isObject} from '@vue/shared'
import {createVNode, isVNode, VNode} from './vnode'


export function h(type: any, propsOrChildren?: any, children?: any): VNode {
    // 参数数量
    const l = arguments.length

    // 两个参数时 第二个参数可能是 props 属性 / children 子VNode
    if (l === 2) {
        // 1. children / props
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVNode(propsOrChildren)) {
                // 1.1 propsOrChildren = children
                return createVNode(type, null, [propsOrChildren])
            }
            // 1.2 propsOrChildren = props
            return createVNode(type, propsOrChildren)
        }
        // 2. props
        else {
            return createVNode(type, null, propsOrChildren)
        }
    }
    // 如果参数大于三个时 ，propsOrChildren = props 第三个开始后续都为 children
    else {
        if (l > 3) {
            children = Array.prototype.slice.call(arguments, 2)
        } else if (l === 3 && isVNode(children)) {
            children = [children]
        }
        return createVNode(type, propsOrChildren, children)
    }
}