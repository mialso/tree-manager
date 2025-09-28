import type { Event } from '../data/event'
import { LOG_LEVEL } from "../log/log-level"
import { Lifecycle } from './lifecycle'
import type { TreeNode } from "./tree"

export type Input = {
    capture: (data: Event) => void
    bubble: (data: Event) => void
}
export type InputProps = Partial<{
    onData: (data: Event) => boolean
    onCtrl: (data: Event) => boolean
}>
type Base = TreeNode & Lifecycle
type InputCreate<P> = <B extends Base>(base: B) => B & Input

export function isInput(node: any): node is Input {
    return node
        && (typeof node.capture === 'function')
        && (typeof node.bubble === 'function')
}

export const initInput = <P extends InputProps>(ext?: P): InputCreate<P> => {
    return (base) => {
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
}
