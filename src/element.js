/** @import {LifecycleExt, TreeNodeExt, CreateElement} from './types' */
import { compose } from 'redux'
import { initLifecycle } from './lifecycle'
import { initInput } from './input'
import { initTreeNode } from './tree'

/** @type {CreateElement} */
export const createElement = (type, props, ext) => {
    return compose(
        initInput(props),
        initLifecycle(props, {}),
        initTreeNode(ext || {}),
    )({ type })
}
