import { LOG_LEVEL, LogSeverity } from "../log/log-level"

export type NodeConfig = {
    type: string
    logSeverity: LogSeverity
}
export type NodeState<P> = {
    type: string
    name?: string
    children: TreeNode<P>[]
    parent: unknown
    depth: number
    logSeverity: LogSeverity
}

export type TreeNode<P = unknown> = {
    type: string
    getChildren: () => TreeNode<unknown>[]
    getParent: () => unknown
    setParent: (node: TreeNode<unknown>) => void
    setName: (name: string) => void
    getDisplayName: (nameOnly?: boolean) => string
    setDepth: (depth: number, source: string) => void
    getDepth: () => number
    appendChild: (node: TreeNode<P>) => void
    removeChild: (node: TreeNode<P>) => void
    setLogSeverity: (logSeverity: LogSeverity) => LogSeverity
    getLogSeverity: () => LogSeverity
    log: (level: LogSeverity, message: string, ...rest: unknown[]) => void
}

export type TreeNodeExt<P = unknown> = Partial<{
    appendChild: (node: TreeNode<P>) => void
    removeChild: (node: TreeNode<P>) => void
    logSeverity: LogSeverity
}>

type TreeNodeCreate<P> = (config: NodeConfig) => TreeNode<P>


export function getSpaces(num = 0) {
    return Array(num * 4).fill(' ').join('');
}
export const nodeTitle = (state: { type: string, name?: string }) => (
    `<${state.type || 'unknown'}${state.name ? `::${state.name}`: ''}>`
)
export const nodeBaseLog = (state: NodeState<unknown>) => `${getSpaces(state.depth)}<${nodeTitle(state)}>`;

export const initTreeNode = <P>(ext?: TreeNodeExt<P>): TreeNodeCreate<P> => {
    return ({ type }: NodeConfig) => {
        const state: NodeState<P> = {
            type,
            name: '',
            parent: null,
            children: [],
            depth: 0,
            logSeverity: ext?.logSeverity || LOG_LEVEL.ERROR,
        };
        const log = (level: LogSeverity, message: string, ...rest: unknown[]) => {
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
                    });
                }
            },
            setName: (name: string) => {
                state.name = name
                // log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: setName: ${name}`);
            },
            getDisplayName: (nameOnly = false) => nameOnly ? state.name : nodeTitle(state),
            getDepth: () => state.depth,
            setDepth: (value: number, source: string) => {
                if (state.depth === value) {
                    return;
                }
                // log(LOG_LEVEL.TRACE, `set depth: ${value}:${source}, children=${state.children.length}`);
                if (state.depth > 10) {
                    log(LOG_LEVEL.ERROR, `exceed depth: ${value}:${source}`);
                    return
                }
                state.depth = value;
                if (Array.isArray(state.children)) {
                    state.children.forEach((child) => {
                      child.setDepth(value + 1, `parent::setDepth ${nodeTitle(state)}`)
                      // child.setLogSeverity(state.logSeverity)
                    });
                }
            },
            appendChild: (child) => {
                log(LOG_LEVEL.DEBUG, `appendChild: ${child.getDisplayName()}, children=${state.children.length}`);
                state.children.push(child);
                /*
                if (state.depth && Array.isArray(state.children)) {
                    state.children.forEach((child) => {
                      child.setDepth(state.depth + 1, `parent::appendChild${nodeTitle(state)}`)
                      // child.setLogSeverity(state.logSeverity)
                    });
                }
                */
                ext?.appendChild && ext.appendChild(child)
            },
            removeChild: (child) => {
                log(LOG_LEVEL.DEBUG, `removeChild: ${child.getDisplayName()}`);
                state.children = state.children.filter((item) => item === child);
                ext?.removeChild && ext.removeChild(child)
            },
            setLogSeverity: (logSeverity: LogSeverity) => {
                if (!ext?.logSeverity) {
                    log(LOG_LEVEL.TRACE, `setLogSeverity: ${logSeverity}`);
                    state.logSeverity = logSeverity
                }
                return state.logSeverity
            },
            getLogSeverity: () => state.logSeverity,
            log,
        });
    }
}
