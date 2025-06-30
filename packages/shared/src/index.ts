export const isArray = Array.isArray;

export const isObject = (val: unknown) => val !== null && typeof val === 'object'

export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(oldValue, value)

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const extend = Object.assign

export const EMPTY_OBJECT: { readonly [key: string]: any } = {}