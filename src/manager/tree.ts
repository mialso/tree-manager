import { LOG_LEVEL, LogSeverity } from "../log/log-level"

export type NodeConfig = {
    type: string
    logSeverity: LogSeverity
}
export type NodeState<P> = {
    type: string
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
export const nodeTitle = (state: { type: string }) => `<${state.type || 'unknown'}>`;
export const nodeBaseLog = (state: NodeState<unknown>) => `${getSpaces(state.depth)}Node<${nodeTitle(state)}>`;

export const initTreeNode = <P>(ext?: TreeNodeExt<P>): TreeNodeCreate<P> => {
    return ({ type }: NodeConfig) => {
        const state: NodeState<P> = {
            type,
            parent: null,
            children: [],
            depth: 0,
            logSeverity: ext?.logSeverity || LOG_LEVEL.ERROR,
        };
        // console.info(`${elementBaseLog(state)}: (init)`);
        const log = (level: LogSeverity, message: string, ...rest: unknown[]) => {
            if (!(level && state.logSeverity >= level && message)) return
            if (level >= LOG_LEVEL.INFO) return console.info(message, ...rest)
            if (level >= LOG_LEVEL.WARN) return console.warn(message, ...rest)
            console.error(message, ...rest)
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
                log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: setParent: ${nodeTitle(node)}`);
                state.parent = node
            },
            getDepth: () => state.depth,
            setDepth: (value: number, source: string) => {
                if (state.depth === value) {
                    return;
                }
                // log(LOG_LEVEL.TRACE, `set depth: ${value}:${source}`);
                if (state.depth > 10) {
                    log(LOG_LEVEL.ERROR, `exceed depth: ${value}:${source}`);
                    return
                }
                state.depth = value;
                if (Array.isArray(state.children)) {
                    state.children.forEach((child) => {
                      child.setDepth(value + 1, `setDepth<${state.type}>`)
                      // child.setLogSeverity(state.logSeverity)
                    });
                }
            },
            appendChild: (child) => {
                log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: appendChild: ${nodeTitle(child)}`);
                state.children.push(child);
                if (state.depth && Array.isArray(state.children)) {
                    state.children.forEach((child) => {
                      child.setDepth(state.depth + 1, `appendChild ${state.type}`)
                      // child.setLogSeverity(state.logSeverity)
                    });
                }
                ext?.appendChild && ext.appendChild(child)
            },
            removeChild: (child) => {
                log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: removeChild: ${nodeTitle(child)}`);
                state.children = state.children.filter((item) => item === child);
                ext?.removeChild && ext.removeChild(child)
            },
            setLogSeverity: (logSeverity: LogSeverity) => {
                if (!ext?.logSeverity) {
                    log(LOG_LEVEL.TRACE, `${nodeBaseLog(state)}: setLogSeverity: ${logSeverity}`);
                    state.logSeverity = logSeverity
                }
                return state.logSeverity
            },
            getLogSeverity: () => state.logSeverity,
            log,
        });
    }
}
