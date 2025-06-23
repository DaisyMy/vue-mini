import {ReactiveEffect} from './effect'

export type Dep = Set<ReactiveEffect>;

export const createDep = (effect?: ReactiveEffect[]): Dep => {
    let dep: Set<ReactiveEffect>;
    dep = new Set<ReactiveEffect>(effect) as Dep;
    return dep;
}