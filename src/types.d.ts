export type Event<P = unknown, M = unknown> = {
    type: string
    payload: P
    meta?: M
}

export type LogSeverity = 1 | 2 | 3 | 4 | 5 | 6

export type NodeConfig = {
    type: string
    logSeverity: LogSeverity
}
export type NodeState<P = unknown> = {
    type: string
    name?: string
    children: TreeNode<P>[]
    parent: TreeNode<P> | null
    depth: number
    logSeverity: LogSeverity
}

export type TreeNode<P = unknown, Ext = {}> = {
    type: string
    getChildren: () => Array<TreeNode<unknown> & Ext>
    getParent: () => TreeNode<unknown> | null
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

export type TreeNodeCreate<P = unknown> = (config: NodeConfig) => TreeNode<P>
export type TreeNodeInit<P = unknown> = (ext?: TreeNodeExt<P>) => TreeNodeCreate<P>


export type LifecycleNodeExt<P = unknown> = {
    commitUpdate: (props: P) => void
    getProps: () => P
    commitMount: () => void
    destroy: () => void
    getNodeLive: () => boolean
}

export type LifecycleNode<P = unknown> = TreeNode<P, Partial<LifecycleNodeExt<P>>> & LifecycleNodeExt<P>

export type ElementCreate<P> = <B extends LifecycleNode<P>>(base: B) => LifecycleNode<P>

export type LifecycleExt<P = unknown> = Partial<{
    commitUpdate: (props: P) => void
    commitMount: () => void
    destroy: () => void
    getName?: () => string
}>

export type InitLifecycle = <P extends { name?: string }>(props: P, ext?: LifecycleExt<P>) => ElementCreate<P>

export type Input = {
    capture: (data: Event) => void
    bubble: (data: Event) => void
}
export type InputProps = Partial<{
    onData: (data: Event) => boolean
    onCtrl: (data: Event) => boolean
}>
export type IsInput = (node: any) => node is Input
export type InputCreate = <B extends LifecycleNode>(base: B) => B & Input
export type InitInput = <P extends InputProps>(ext?: P) => InputCreate<P>

export type CreateElement = <P>(type: string, props: unknown, ext?: TreeNodeExt<P> & LifecycleExt<P>) => any
