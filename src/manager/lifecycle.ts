import { LOG_LEVEL } from "../log/log-level"
import { TreeNode, getSpaces } from "./tree"

export type Lifecycle<P = unknown> = {
    commitUpdate: (props: P) => void
    getProps: () => P
    commitMount: () => void
    destroy: () => void
    getNodeLive: () => boolean
}
export const OWN_PROP_KEYS = ['children', 'key'];

export const elementBaseLog = (getDepth: () => number, type: string) => `${getSpaces(getDepth())}Element<${type}>`;

type ElementCreate<P> = <B extends TreeNode<P>>(base: B) => B & Lifecycle<P>
// type ElementInit<P> = (p: P) => Partial<Lifecycle<P>>
//
export type LifecycleExt<P> = Partial<{
    commitUpdate: (props: P) => void
    commitMount: () => void
    destroy: () => void
}>

export const initLifecycle = <P>(props: P, ext?: LifecycleExt<P>): ElementCreate<P> => {
    return (base) => {
        const state = {
            props,
            mounted: base.type === 'root' || false,
            destroyed: false,
        }
        const log = (base: TreeNode<P>, text: string) => {
            base.log(LOG_LEVEL.TRACE, `${elementBaseLog(base.getDepth, base.type)}: ${text}`);
        }
        const getNodeLive = () => state.mounted && !state.destroyed
        return ({
            ...base,
            getProps: () => state.props,
            getNodeLive,
            commitMount: () => {
                log(base, 'commitMount');
                state.mounted = true
                ext?.commitMount && ext.commitMount()
            },
            commitUpdate: (newProps) => {
                if (!getNodeLive()) {
                    const errorText = `invalid update mounted=${state.mounted} destroyed=${state.destroyed}`
                    base.log(LOG_LEVEL.ERROR, `${elementBaseLog(base.getDepth, base.type)}: ${errorText}`)
                    return
                }
                if (typeof newProps !== 'object') {
                    return
                }
                const propsString = Object.keys(newProps)
                    .filter((key) => !OWN_PROP_KEYS.includes(key))
                    .reduce((acc, key) => {
                        if (state.props[key] !== newProps[key]) {
                            return acc.concat(` ${key}`);
                        }
                        return acc;
                    }, '');
                log(base, `commitUpdate: ${propsString}`);
                state.props = newProps
                ext?.commitUpdate && ext.commitUpdate(newProps)
            },
            destroy: () => {
                log(base, 'destroy')
                state.destroyed = true
                const children = base.getChildren()
                // TODO: not required to traverse children?
                children.forEach((child: any) => child?.destroy());
                // TODO: before children destroy?
                ext?.destroy && ext.destroy()
            },
        });
    }
}
