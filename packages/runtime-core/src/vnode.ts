import {normalizeClass, ShapeFlags, isString, isArray, isFunction, isObject} from '@vue/shared'

export interface VNode {
    __v_isVNode: true
    type: any
    props: any
    children: any
    shapeFlag: number
}

/**
 * 生成 VNode 对象  计算 shapeFlag 并返回
 * @param type
 * @param props
 * @param children
 */
export function createVNode(type: any, props: any, children?: any): VNode {
    if (props) {
        let {class: klass, style} = props
        if (klass && !isString(klass)) {
            props.class = normalizeClass(klass)
        }
    }
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0
    return createBaseVNode(type, props, children, shapeFlag)
}

/**
 * 构建基础 vnode 判断 children
 * @param type
 * @param props
 * @param children
 * @param shapeFlag
 */
function createBaseVNode(type: any, props: any, children: any, shapeFlag: number): VNode {
    const vnode: VNode = {
        __v_isVNode: true,
        type,
        props,
        children,
        shapeFlag
    }

    normalizeChildren(vnode, children)

    return vnode
}

export function normalizeChildren(vnode: VNode, children: unknown) {
    let type = 0
    // const {shapeFlag} = vnode
    if (children == null) {
        children = null
    } else if (isArray(children)) {
        // TODO array
        type = ShapeFlags.ARRAY_CHILDREN
    } else if (typeof children === 'object') {
        // TODO object
    } else if (isFunction(children)) {
        // TODO function
    } else {
        // children 为 string
        children = String(children)
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.children = children
    // 按位或赋值
    vnode.shapeFlag |= type
}

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export function isVNode(value: any): value is VNode {
    return value ? value.__v_isVNode === true : false
}