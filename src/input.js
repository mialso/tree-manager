/** @import {IsInput, InitInput} from './types' */
import { LOG_LEVEL } from './log-level.js'

/** @type {IsInput} */
export function isInput(node) {
    return node
        && (typeof node.capture === 'function')
        && (typeof node.bubble === 'function')
}

/** @type {InitInput} */
export const initInput = (ext) => (base) => {
    return ({
        ...base,
        capture: (data) => {
            if (!base.getNodeLive()) {
                base.log(LOG_LEVEL.ERROR, 'invalid capture lifecycle')
                return
            }
            const prevent = !!(ext && ext.onCtrl && ext.onCtrl(data))
            // const prevent = !!(ext.capture && ext.capture())
            if (prevent) {
                return
            }
            base.log(LOG_LEVEL.TRACE, 'capture data=',  data)
            base.getChildren().forEach((child) => {
                if (isInput(child)) {
                    child.capture(data)
                }
            })
        },
        bubble: (data) => {
            if (!base.getNodeLive()) {
                base.log(LOG_LEVEL.ERROR, 'invalid bubble lifecycle')
                return
            }
            const prevent = !!(ext && ext.onData && ext.onData(data))
            if (prevent) {
                return
            }
            base.log(LOG_LEVEL.TRACE, 'bubble data=', data)
            const parent = base.getParent()
            if (isInput(parent)) {
                parent.bubble(data)
            }
        },
    })
}
