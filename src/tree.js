/** @import {LogSeverity, NodeState, TreeNodeInit} from './types' */
import { LOG_LEVEL } from './log-level.js'

/** @type {(num?: number) => string} */
export function getSpaces(num = 0) {
    return Array(num * 4).fill(' ').join('')
}
/** @type {(state: NodeState) => string} */
export const nodeTitle = (state) => (
    `<${state.type || 'unknown'}${state.name ? `::${state.name}`: ''}>`
)
/** @type {(state: NodeState) => string} */
export const nodeBaseLog = (state) => `${getSpaces(state.depth)}<${nodeTitle(state)}>`

/** @type {TreeNodeInit} */
export const initTreeNode = (ext) => ({ type }) => {
    /** @type {NodeState} */
    const state = {
        type,
        name: '',
        parent: null,
        children: [],
        depth: 0,
        logSeverity: ext?.logSeverity || LOG_LEVEL.ERROR,
    }
    /**
     * @param {LogSeverity} level
     * @param {string} message
     */
    const log = (level, message, ...rest) => {
        if (!(level && state.logSeverity >= level && message)) return
        const nodeBase = nodeBaseLog(state)
        if (level >= LOG_LEVEL.INFO) return console.info(`${nodeBase} ${message}`, ...rest)
        if (level >= LOG_LEVEL.WARN) return console.warn(`${nodeBase} ${message}`, ...rest)
        console.error(`${nodeBase} ${message}`, ...rest)
    }
    return ({
        type: state.type,
        getChildren: () => state.children,
        getParent: () => state.parent,
        setParent: (node) => {
            const parentLogSeverity = node?.getLogSeverity()
            if (parentLogSeverity && parentLogSeverity > state.logSeverity && !ext?.logSeverity) {
                state.logSeverity = parentLogSeverity
            }
            if (!state.name) {
                const parentName = node.getDisplayName(true)
                if (parentName) {
                    state.name = `^${parentName}`
                }
            }
            // log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: setParent: ${node.getDisplayName()}`);
            state.parent = node
            // setDepth here, doesn't work at appendChild
            state.depth = node.getDepth() + 1
            if (state.depth && Array.isArray(state.children)) {
                state.children.forEach((child) => {
                    child.setDepth(state.depth + 1, `parent::setParent ${nodeTitle(state)}`)
                    // child.setLogSeverity(state.logSeverity)
                })
            }
        },
        /** @param {string} name */
        setName: (name) => {
            state.name = name
            // log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: setName: ${name}`);
        },
        getDisplayName: (nameOnly = false) => nameOnly ? state.name : nodeTitle(state),
        getDepth: () => state.depth,
        /** @type {(value: number, source: string) => void} */
        setDepth: (value, source) => {
            if (state.depth === value) {
                return
            }
            // log(LOG_LEVEL.TRACE, `set depth: ${value}:${source}, children=${state.children.length}`);
            if (state.depth > 10) {
                log(LOG_LEVEL.ERROR, `exceed depth: ${value}:${source}`)
                return
            }
            state.depth = value
            if (Array.isArray(state.children)) {
                state.children.forEach((child) => {
                    child.setDepth(value + 1, `parent::setDepth ${nodeTitle(state)}`)
                    // child.setLogSeverity(state.logSeverity)
                })
            }
        },
        appendChild: (child) => {
            log(LOG_LEVEL.DEBUG, `appendChild: ${child.getDisplayName()}, children=${state.children.length}`)
            state.children.push(child)
            /*
             *if (state.depth && Array.isArray(state.children)) {
             *    state.children.forEach((child) => {
             *        child.setDepth(state.depth + 1, `parent::appendChild${nodeTitle(state)}`)
             *        // child.setLogSeverity(state.logSeverity)
             *    });
             *}
             */
            ext?.appendChild && ext.appendChild(child)
        },
        removeChild: (child) => {
            log(LOG_LEVEL.DEBUG, `removeChild: ${child.getDisplayName()}`)
            state.children = state.children.filter((item) => item === child)
            ext?.removeChild && ext.removeChild(child)
        },
        /** @type {(logSeverity: LogSeverity) => LogSeverity} */
        setLogSeverity: (logSeverity) => {
            if (!ext?.logSeverity) {
                log(LOG_LEVEL.TRACE, `setLogSeverity: ${logSeverity}`)
                state.logSeverity = logSeverity
            }
            return state.logSeverity
        },
        getLogSeverity: () => state.logSeverity,
        log,
    })
}
