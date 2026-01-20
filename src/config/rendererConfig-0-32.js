/* eslint-disable no-unused-vars */
/*
 *"react-reconciler": "0.32.0",
 *"react": "19.1.1"
 */
/** @import {LifecycleExt, TreeNode} from '../types' */
import { OWN_PROP_KEYS } from '../lifecycle.js'
import { createElement } from '../element.js'

/** @typedef {TreeNode & LifecycleExt} Instance */

/** @type {(p: { getInstance: (type: string, props: unknown, rootContainer: Instance) => Instance }) => (type: string, props: unknown, rootContainer: Instance, hostContext: unknown, internalInstanceHandle: Object) => Instance} */
export const instanceCreator = ({ getInstance }) => (type, props, rootContainer, hostContext, internalInstanceHandle) => {
    // console.log(`instanceCreator`, { key: _fiberNode.key })
    const instance = getInstance(type, props, rootContainer)
    if (!instance) {
        console.log(`instanceCreator NO INSTANCE ${type}`)
        return createElement(type, props)
    }
    return instance
}


const hostContext = Object.freeze({})
const scheduleTimeout = typeof setTimeout === 'function' ? setTimeout : undefined
export const cancelTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined
/*
 *const scheduleTimeout = (fn) => fn()
 *export const cancelTimeout = () => {}
 */
export const noTimeout = -1
const localPromise = typeof Promise === 'function' ? Promise : undefined
function handleErrorInNextTick(error) {
    setTimeout(() => {
        throw error
    })
}

export function createHostConfig ({ getInstance, DefaultEventPriority }) {
    const hostConfig = {
        rendererVersion: '1.0.0',
        rendererPackageName: 'tree-manager',
        extraDevToolsConfig: null,

        getPublicInstance: (instance) => instance,
        getRootHostContext: (_rootInstance) => hostContext,
        getChildHostContext: (parentContext, _type) => parentContext,
        prepareForCommit: (_containerInfo) => null,
        resetAfterCommit: () => undefined,
        createInstance: instanceCreator({ getInstance }),
        /** @type {(instance: Instance, keepChildren: boolean) => Instance} */
        cloneMutableInstance: (instance, keepChildren) => {
            // TODO: need an implemenation?
            console.log('cloneMutableInstance TODO')
            return instance
        },
        /** @type {(parentInstancve: Instance, child: Instance) => void} */
        appendInitialChild: (parentInstance, child) => {
            child.setParent(parentInstance)
            return parentInstance.appendChild(child)
        },
        /** @type {(node: Instance, type: string, props: unknown, hostContext: unknown) => boolean} */
        finalizeInitialChildren: (node, type, props, hostContext) => {
            // to receive "commitMount"
            return true
        },
        /** @type {(type: string, props: unknown) => boolean} */
        shouldSetTextContent: (type, props) => false,
        createTextInstance: () => {
            throw new Error('not implemented')
        },
        cloneMutableTextInstance: () => {
            throw new Error('not implemented')
        },

        scheduleTimeout,
        cancelTimeout,
        noTimeout,
        isPrimaryRenderer: false,
        warnsIfNotActing: null, // TODO: try "true" as react-dom has
        supportsMutation: true,
        supportsPersistence: false,
        supportsHydration: false,

        getInstanceFromNode: null,
        beforeActiveInstanceBlur: null,
        afterActiveInstanceBlur: null,
        /** @type {() => void} */
        preparePortalMount: () => undefined,
        prepareScopeUpdate: null,
        getInstanceFromScope: null,

        /** @type {() => void} */
        setCurrentUpdatePriority: () => undefined,
        getCurrentUpdatePriority: () => DefaultEventPriority,
        resolveUpdatePriority: () => DefaultEventPriority,
        /** @type {() => void} */
        trackSchedulerEvent: () => undefined,
        resolveEventType: null, // () => string | null
        resolveEventTimeStamp: null, // () => number
        shouldAttemptEagerTransition: null,
        /** @type {() => void} */
        detachDeletedInstance: () => undefined,
        requestPostPaintCallback: null,
        /** @type {(type: string, props: unknown) => boolean} */
        maySuspendCommit: (type, props) => false,
        /** @type {(type: string, oldProps: unknown, newProps: unknown) => boolean} */
        maySuspendCommitOnUpdate: (type, oldProps, newProps) => false,
        /** @type {(type: string, props: unknown) => boolean} */
        maySuspendCommitInSyncRender: (type, props) => false,
        preloadInstance: null, // (instance: Instance, type, props) => boolean
        startSuspendingCommit: null,
        suspendInstance: null,
        suspendOnActiveViewTransition: null, // (rootContainer) => void
        waitForCommitToBeReady: () => null,
        NotPendingTransition: null,
        HostTransitionContext: null,
        resetFormInstance: null,
        bindToConsole: null,

        /*
         * -------------------
         *      Mutation
         *     (optional)
         * -------------------
         */
        /** @type {(parentInstance: Instance, child: Instance) => void} */
        appendChild: (parentInstance, child) => {
            parentInstance.appendChild(child)
            child.setParent(parentInstance)
        },
        /** @type {(container: Instance, child: Instance) => void} */
        appendChildToContainer: (container, child) => {
            child.setDepth(1, 'appendChildToContainer')
            container.appendChild(child)
            // TODO: should set parent?
        },
        commitTextUpdate: () => {},
        /** @type {(instance: Instance, type: string, newProps: unknown, internalInstanceHandle: Object) => void} */
        commitMount: (instance, type, newProps, internalInstanceHandle) => {
            instance.commitMount()
        },
        /** @type {(instance: Instance, type: string, prevProps: unknown, nextProps: unknown, internalInstanceHandle: Object) => void} */
        commitUpdate: (instance, type, prevProps, nextProps, internalInstanceHandle) => {
            // instance.commitUpdate(nextProps);
            const hasUpdate = Object.keys(nextProps)
                .filter((key) => !OWN_PROP_KEYS.includes(key))
                .reduce((acc, key) => {
                    return acc || (prevProps[key] !== nextProps[key])
                }, false)
            if (hasUpdate) {
                instance.commitUpdate(nextProps)
            }
        },
        /** @type {(parentInstance: Instance, child: Instance, _beforeChild: Instance) => void} */
        insertBefore: (parentInstance, child, _beforeChild) => {
            parentInstance.appendChild(child)
            child.setParent(parentInstance)
        },
        /** @type {(parentInstance: Instance, child: Instance, _afterChild: Instance) => void} */
        insertInContainerBefore: (parentInstance, child, _afterChild) =>  {
            parentInstance.appendChild(child)
            child.setParent(parentInstance)
        },
        /** @type {(parentInstance: Instance, child: Instance) => void} */
        removeChild: (parentInstance, child) => {
            // TODO: not expected to traverse child tree here
            if (typeof child.destroy === 'function') {
                child.destroy()
            }
            parentInstance.removeChild(child)
        },
        /** @type {() => void} */
        removeChildFromContainer: (...ppp) => {
            throw new Error('not implemented')
        },
        /** @type {() => void} */
        resetTextContent: () => undefined,
        /** @type {() => void} */
        hideInstance: () => undefined,
        /** @type {() => void} */
        hideTextInstance: () => undefined,
        /** @type {() => void} */
        unhideInstance: () => undefined,
        /** @type {() => void} */
        unhideTextInstance: () => undefined,
        applyViewTransitionName: null,
        restoreViewTransitionName: null,
        cancelViewTransitionName: null,
        cancelRootViewTransitionName: null,
        restoreRootViewTransitionName: null,
        cloneRootViewTransitionContainer: null,
        removeRootViewTransitionClone: null,
        measureInstance: null,
        measureClonedInstance: null,
        wasInstanceInViewport: null,
        hasInstanceChanged: null,
        hasInstanceAffectedParent: null,
        startViewTransition: null,
        startGestureTransition: null,
        stopViewTransition: null,
        getCurrentGestureOffset: null,
        createViewTransitionInstance: null,
        /** @type {(container: unknown) => void} */
        clearContainer: (container) => undefined,
        createFragmentInstance: null,
        updateFragmentInstanceFiber: null,
        commitNewChildToFragmentInstance: null,
        deleteChildFromFragmentInstance: null,

        /*
         * -------------------
         *      Microtasks
         *     (optional)
         * -------------------
         */
        supportsMicrotasks: true,
        scheduleMicrotask:
            typeof queueMicrotask === 'function'
                ? queueMicrotask
                : typeof localPromise !== 'undefined'
                    ? (callback) => localPromise.resolve(null).then(callback).catch(handleErrorInNextTick)
                    : scheduleTimeout,
    }

    return hostConfig
}


/*
 * -------------------
 *      Test selectors
 *     (optional)
 * -------------------
 */
/*
 *export const supportsTestSelectors = $$$config.supportsTestSelectors;
 *export const findFiberRoot = $$$config.findFiberRoot;
 *export const getBoundingRect = $$$config.getBoundingRect;
 *export const getTextContent = $$$config.getTextContent;
 *export const isHiddenSubtree = $$$config.isHiddenSubtree;
 *export const matchAccessibilityRole = $$$config.matchAccessibilityRole;
 *export const setFocusIfFocusable = $$$config.setFocusIfFocusable;
 *export const setupIntersectionObserver = $$$config.setupIntersectionObserver;
 */

/*
 * -------------------
 *     Persistence
 *     (optional)
 * -------------------
 */
/*
 *export const cloneInstance = $$$config.cloneInstance;
 *export const createContainerChildSet = $$$config.createContainerChildSet;
 *export const appendChildToContainerChildSet =
 *  $$$config.appendChildToContainerChildSet;
 *export const finalizeContainerChildren = $$$config.finalizeContainerChildren;
 *export const replaceContainerChildren = $$$config.replaceContainerChildren;
 *export const cloneHiddenInstance = $$$config.cloneHiddenInstance;
 *export const cloneHiddenTextInstance = $$$config.cloneHiddenTextInstance;
 */

/*
 * -------------------
 *     Hydration
 *     (optional)
 * -------------------
 */
/*
 *export const isSuspenseInstancePending = $$$config.isSuspenseInstancePending;
 *export const isSuspenseInstanceFallback = $$$config.isSuspenseInstanceFallback;
 *export const getSuspenseInstanceFallbackErrorDetails =
 *  $$$config.getSuspenseInstanceFallbackErrorDetails;
 *export const registerSuspenseInstanceRetry =
 *  $$$config.registerSuspenseInstanceRetry;
 *export const canHydrateFormStateMarker = $$$config.canHydrateFormStateMarker;
 *export const isFormStateMarkerMatching = $$$config.isFormStateMarkerMatching;
 *export const getNextHydratableSibling = $$$config.getNextHydratableSibling;
 *export const getNextHydratableSiblingAfterSingleton =
 *  $$$config.getNextHydratableSiblingAfterSingleton;
 *export const getFirstHydratableChild = $$$config.getFirstHydratableChild;
 *export const getFirstHydratableChildWithinContainer =
 *  $$$config.getFirstHydratableChildWithinContainer;
 *export const getFirstHydratableChildWithinActivityInstance =
 *  $$$config.getFirstHydratableChildWithinActivityInstance;
 *export const getFirstHydratableChildWithinSuspenseInstance =
 *  $$$config.getFirstHydratableChildWithinSuspenseInstance;
 *export const getFirstHydratableChildWithinSingleton =
 *  $$$config.getFirstHydratableChildWithinSingleton;
 *export const canHydrateInstance = $$$config.canHydrateInstance;
 *export const canHydrateTextInstance = $$$config.canHydrateTextInstance;
 *export const canHydrateActivityInstance = $$$config.canHydrateActivityInstance;
 *export const canHydrateSuspenseInstance = $$$config.canHydrateSuspenseInstance;
 *export const hydrateInstance = $$$config.hydrateInstance;
 *export const hydrateTextInstance = $$$config.hydrateTextInstance;
 *export const hydrateActivityInstance = $$$config.hydrateActivityInstance;
 *export const hydrateSuspenseInstance = $$$config.hydrateSuspenseInstance;
 *export const getNextHydratableInstanceAfterActivityInstance =
 *  $$$config.getNextHydratableInstanceAfterActivityInstance;
 *export const getNextHydratableInstanceAfterSuspenseInstance =
 *  $$$config.getNextHydratableInstanceAfterSuspenseInstance;
 *export const commitHydratedInstance = $$$config.commitHydratedInstance;
 *export const commitHydratedContainer = $$$config.commitHydratedContainer;
 *export const commitHydratedActivityInstance =
 *  $$$config.commitHydratedActivityInstance;
 *export const commitHydratedSuspenseInstance =
 *  $$$config.commitHydratedSuspenseInstance;
 *export const finalizeHydratedChildren = $$$config.finalizeHydratedChildren;
 *export const flushHydrationEvents = $$$config.flushHydrationEvents;
 *export const clearActivityBoundary = $$$config.clearActivityBoundary;
 *export const clearSuspenseBoundary = $$$config.clearSuspenseBoundary;
 *export const clearActivityBoundaryFromContainer =
 *  $$$config.clearActivityBoundaryFromContainer;
 *export const clearSuspenseBoundaryFromContainer =
 *  $$$config.clearSuspenseBoundaryFromContainer;
 *export const hideDehydratedBoundary = $$$config.hideDehydratedBoundary;
 *export const unhideDehydratedBoundary = $$$config.unhideDehydratedBoundary;
 *export const shouldDeleteUnhydratedTailInstances =
 *  $$$config.shouldDeleteUnhydratedTailInstances;
 *export const diffHydratedPropsForDevWarnings =
 *  $$$config.diffHydratedPropsForDevWarnings;
 *export const diffHydratedTextForDevWarnings =
 *  $$$config.diffHydratedTextForDevWarnings;
 *export const describeHydratableInstanceForDevWarnings =
 *  $$$config.describeHydratableInstanceForDevWarnings;
 *export const validateHydratableInstance = $$$config.validateHydratableInstance;
 *export const validateHydratableTextInstance =
 *  $$$config.validateHydratableTextInstance;
 */

/*
 * -------------------
 *     Resources
 *     (optional)
 * -------------------
 */
/*
 *export type HoistableRoot = mixed;
 *export type Resource = mixed;
 *export const supportsResources = $$$config.supportsResources;
 *export const isHostHoistableType = $$$config.isHostHoistableType;
 *export const getHoistableRoot = $$$config.getHoistableRoot;
 *export const getResource = $$$config.getResource;
 *export const acquireResource = $$$config.acquireResource;
 *export const releaseResource = $$$config.releaseResource;
 *export const hydrateHoistable = $$$config.hydrateHoistable;
 *export const mountHoistable = $$$config.mountHoistable;
 *export const unmountHoistable = $$$config.unmountHoistable;
 *export const createHoistableInstance = $$$config.createHoistableInstance;
 *export const prepareToCommitHoistables = $$$config.prepareToCommitHoistables;
 *export const mayResourceSuspendCommit = $$$config.mayResourceSuspendCommit;
 *export const preloadResource = $$$config.preloadResource;
 *export const suspendResource = $$$config.suspendResource;
 */

/*
 * -------------------
 *     Singletons
 *     (optional)
 * -------------------
 */
/*
 *export const supportsSingletons = $$$config.supportsSingletons;
 *export const resolveSingletonInstance = $$$config.resolveSingletonInstance;
 *export const acquireSingletonInstance = $$$config.acquireSingletonInstance;
 *export const releaseSingletonInstance = $$$config.releaseSingletonInstance;
 *export const isHostSingletonType = $$$config.isHostSingletonType;
 *export const isSingletonScope = $$$config.isSingletonScope;
 */
