/** @import {InitLifecycle} from './types' */

import { LOG_LEVEL } from './log-level'
import { getSpaces } from './tree'

export const OWN_PROP_KEYS = ['children', 'key'];

/** @type {(getDepth: () => number, name: string) => string} */
export const elementBaseLog = (getDepth, name) => (
    `${getSpaces(getDepth())}${name}`
);

/** @type {InitLifecycle} */
export const initLifecycle = (props, ext) => (base) => {
    const state = {
        props,
        mounted: base.type === 'root' || false,
        destroyed: false,
    }
    const getNodeLive = () => state.mounted && !state.destroyed
    // const name = props.name || props.key
    const name = props.name || (ext?.getName && ext.getName())
    if (name) {
        base.setName(name)
    }
    return ({
        ...base,
        getProps: () => state.props,
        getNodeLive,
        commitMount: () => {
            base.log(LOG_LEVEL.TRACE, 'commitMount');
            state.mounted = true
            ext?.commitMount && ext.commitMount()
        },
        commitUpdate: (newProps) => {
            if (!getNodeLive()) {
                const errorText = `invalid update mounted=${state.mounted} destroyed=${state.destroyed}`
                base.log(LOG_LEVEL.ERROR, errorText)
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
            base.log(LOG_LEVEL.TRACE, `commitUpdate: ${propsString}`);
            state.props = newProps
            ext?.commitUpdate && ext.commitUpdate(newProps)
        },
        destroy: () => {
            base.log(LOG_LEVEL.TRACE, 'destroy')
            state.destroyed = true
            const children = base.getChildren()
            // TODO: not required to traverse children?
            children.forEach((child) => child?.destroy());
            // TODO: before children destroy?
            ext?.destroy && ext.destroy()
        },
    });
}
