// import ReactReconciler from 'react-reconciler';
/*
 *"react-reconciler": "0.29.2",
 *"react": "18.3.1"
 */
import { OWN_PROP_KEYS } from './lifecycle';
import { createElement } from './element';

export const instanceCreator = ({ getInstance }) => (type, props, rootContainer, _a, _fiberNode) => {
    // console.log(`instanceCreator`, { key: _fiberNode.key })
    const instance = getInstance(type, props, rootContainer)
    if (!instance) {
        console.log(`instanceCreator NO INSTANCE ${type}`)
        return createElement(type, props);
    }
    return instance
}

/*
 * for reference
 * https://github.com/facebook/react/blob/main/packages/react-reconciler/src/forks/ReactFiberConfig.custom.js
 */

/*
 * core
 */
export function getPublicInstance(instance) {
    return instance;
}

export function getRootHostContext(_rootContainer) {
    return null;
}

export function getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext;
}

export function prepareForCommit() {
    return null
}

export function resetAfterCommit() { }

// createInstance placeholder

export function appendInitialChild(parentInstance, child) {
    // console.log('appendInitialChild')
    child.setParent(parentInstance)
    return parentInstance.appendChild(child);
}

export function finalizeInitialChildren() {
    // to receive "commitMount"
    return true;
}

export function shouldSetTextContent() {
    return false;
}

export function createTextInstance(_text) {
    throw new Error('not implemented')
    // return { data: text };
}

export const scheduleTimeout = setTimeout;
// export const scheduleTimeout = (fn) => fn();
export const cancelTimeout = clearTimeout;
const noTimeout = -1;
/*
 * const noTimeout = 1;
 * console.log('moduleRenderer', { noTimeout })
 */
const isPrimaryRenderer = true;

export const warnsIfNotActing = null;
export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
export const supportsMicrotasks = true;
export const scheduleMicrotask = queueMicrotask;
export const supportsTestSelectors = false;
export const getInstanceFromNode = null;
export const beforeActiveInstanceBlur = null;
export const afterActiveInstanceBlur = null;

export function preparePortalMount() { };
export const prepareScopeUpdate = null;
export const getInstanceFromScope = null;
export const setCurrentUpdatePriority = null;
export const getCurrentUpdatePriority = null;
export const resolveUpdatePriority = null;
export const shouldAttemptEagerTransition = null;
export function detachDeletedInstance() { }
export const requestPostPaintCallback = null;
export const NotPendingTransition = null;
export const resetFormInstance = null;

// TODO: strange, not mentioned in the docs
export function prepareUpdate(_instance, _type, _prevProps, _nextProps, _rootContainer) {
    return _nextProps;
}
/*
 * mutation
 */

export function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
    child.setParent(parentInstance);
}
export function appendChildToContainer(container, child) {
    child.setDepth(1, 'appendChildToContainer')
    container.appendChild(child);
    // TODO: should set parent?
}

export function commitTextUpdate() { }

export function commitMount(instance, _type, _props, _fiberNode) {
    return instance.commitMount();
}

export function commitUpdate(instance, nextProps, _type, prevProps, _internalProps) {
    /*
     * TODO: what's _internalProps
     * instance.commitUpdate(nextProps);
     */
    const hasUpdate = Object.keys(nextProps)
        .filter((key) => !OWN_PROP_KEYS.includes(key))
        .reduce((acc, key) => {
            return acc || (prevProps[key] !== nextProps[key])
        }, false)
    if (hasUpdate) {
        instance.commitUpdate(nextProps);
    }
}

export function insertBefore(parentInstance, newInstance, _beforeInstance) {
    parentInstance.appendChild(newInstance);
    newInstance.setParent(parentInstance);
}
export function insertInContainerBefore() { }

export function removeChild(parentInstance, child) {
    // TODO: not expected to traverse child tree here
    if (typeof child.destroy === 'function') {
        child.destroy();
    }
    parentInstance.removeChild(child);
}

export function removeChildFromContainer(container, child) {
    removeChild(container, child);
}

export function resetTextContent() { }

export function hideInstance(_instance) {
    // TODO: Suspense
}
export const hideTextInstance = null;
export function unhideInstance(_instance, _props) {
    // TODO: Suspense
}
export const unhideTextInstance = null;
export function clearContainer() { }
export function maySuspendCommit(_type, _props) {
    // TODO: Suspense
}
export const preloadInstance = null;
export const startSuspendingCommit = null;
export const suspendInstance = null;
export function waitForCommitToBeReady() {
    // TODO: Suspense
    return null;
}

export function createReconciler({ getInstance }) {
    const hostConfig = {
        // core
        createInstance: instanceCreator({ getInstance }),
        appendInitialChild,
        finalizeInitialChildren,
        createTextInstance,
        getPublicInstance,
        prepareForCommit,
        prepareUpdate,
        resetAfterCommit,
        shouldSetTextContent,
        getRootHostContext,
        /*
         * TODO
         * getCurrentEventPriority
         */
        getChildHostContext,
        clearContainer,
        detachDeletedInstance,
        preparePortalMount,
        scheduleTimeout,
        cancelTimeout,
        noTimeout,
        isPrimaryRenderer,

        // mutation
        supportsMutation,
        appendChild,
        appendChildToContainer,
        commitTextUpdate,
        commitMount,
        commitUpdate,
        insertBefore,
        insertInContainerBefore,
        removeChild,
        removeChildFromContainer,
        resetTextContent,
        // TODO: suspense
        hideInstance,
        unhideInstance,
        maySuspendCommit,
        waitForCommitToBeReady,

        // microtasks
        supportsMicrotasks,
        scheduleMicrotask,

        supportsPersistence,
        supportsHydration,
        supportsTestSelectors,
    };
    return hostConfig;
    // return ReactReconciler(hostConfig);
}
