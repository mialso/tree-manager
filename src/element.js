/** @import {CreateElement} from './types' */
import { initLifecycle } from './lifecycle.js'
import { initInput } from './input.js'
import { initTreeNode } from './tree.js'

// simple util, same as redux "compose"
export function compose(...funcs) {
    if (funcs.length === 0) {
        return (arg) => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce(
        (a, b) =>
            (...args) =>
                a(b(...args)),
    )
}

/** @type {CreateElement} */
export const createElement = (type, props, ext) => {
    return compose(
        initInput(props),
        initLifecycle(props, {}),
        initTreeNode(ext || {}),
    )({ type })
}
