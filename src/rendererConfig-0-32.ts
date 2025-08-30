/*
    "react-reconciler": "0.32.0",
    "react": "19.1.1"
*/
import { Lifecycle, OWN_PROP_KEYS } from './manager/lifecycle';
import type { TreeNode } from './manager/tree'

export const instanceCreator = ({ getInstance }) => (type: string, props: unknown, rootContainer: Instance, hostContext: unknown, internalInstanceHandle: Object) => {
    // console.log(`instanceCreator`, { key: _fiberNode.key })
    const instance = getInstance(type, props, rootContainer)
    if (!instance) {
        console.log(`instanceCreator NO INSTANCE ${type}`)
        return createElement(type, props);
    }
    return instance
}

type Instance = TreeNode & Lifecycle

const hostContext = Object.freeze({})
const scheduleTimeout = typeof setTimeout === 'function' ? setTimeout : undefined
export const cancelTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined
/*
const scheduleTimeout = (fn) => fn()
export const cancelTimeout = () => {}
*/
export const noTimeout = -1;
const localPromise = typeof Promise === 'function' ? Promise : undefined
function handleErrorInNextTick(error) {
  setTimeout(() => {
    throw error;
  });
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
        cloneMutableInstance: (instance: Instance, _keepChildren: boolean): Instance => {
            // TODO: need an implemenation?
            console.log(`cloneMutableInstance TODO`)
            return instance
        },
        appendInitialChild: (parentInstance: Instance, child: Instance) => {
            child.setParent(parentInstance)
            return parentInstance.appendChild(child)
        },
        finalizeInitialChildren: (node: Instance, type: string, props: unknown, hostContext: unknown) => {
            // to receive "commitMount"
            return true;
        },
        shouldSetTextContent: (type: string, props: unknown) => false,
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
        preparePortalMount: (): void => undefined,
        prepareScopeUpdate: null,
        getInstanceFromScope: null,

        setCurrentUpdatePriority: (): void => undefined,
        getCurrentUpdatePriority: () => DefaultEventPriority,
        resolveUpdatePriority: () => DefaultEventPriority,
        trackSchedulerEvent: (): void => undefined,
        resolveEventType: null, // () => string | null
        resolveEventTimeStamp: null, // () => number
        shouldAttemptEagerTransition: null,
        detachDeletedInstance: (): void => undefined,
        requestPostPaintCallback: null,
        maySuspendCommit: (type, props): boolean => false,
        maySuspendCommitOnUpdate: (type, oldProps, newProps): boolean => false,
        maySuspendCommitInSyncRender: (type, props): boolean => false,
        preloadInstance: null, // (instance: Instance, type, props) => boolean
        startSuspendingCommit: null,
        suspendInstance: null,
        suspendOnActiveViewTransition: null, // (rootContainer) => void
        waitForCommitToBeReady: () => null,
        NotPendingTransition: null,
        HostTransitionContext: null,
        resetFormInstance: null,
        bindToConsole: null,

        // -------------------
        //      Mutation
        //     (optional)
        // -------------------
        appendChild: (parentInstance: Instance, child: Instance): void => {
            parentInstance.appendChild(child);
            child.setParent(parentInstance);
        },
        appendChildToContainer: (container, child: Instance): void => {
            child.setDepth(1, 'appendChildToContainer')
            container.appendChild(child);
            // TODO: should set parent?
        },
        commitTextUpdate: () => {},
        commitMount: (instance: Instance, _type: string, _newProps: unknown, internalInstanceHandle: Object): void => {
            instance.commitMount();
        },
        commitUpdate: (instance: Instance, _type: string, prevProps: unknown, nextProps: unknown, internalInstanceHandle: Object): void => {
            // instance.commitUpdate(nextProps);
            const hasUpdate = Object.keys(nextProps)
                .filter((key) => !OWN_PROP_KEYS.includes(key))
                .reduce((acc, key) => {
                    return acc || (prevProps[key] !== nextProps[key])
                }, false)
            if (hasUpdate) {
                instance.commitUpdate(nextProps);
            }
        },
        insertBefore: (parentInstance: Instance, child: Instance, _beforeChild: Instance): void => {
            parentInstance.appendChild(child);
            child.setParent(parentInstance);
        },
        insertInContainerBefore: (): void =>  {
            throw new Error('not implemented')
        },
        removeChild: (parentInstance: Instance, child: Instance): void => {
            // TODO: not expected to traverse child tree here
            if (typeof child.destroy === 'function') {
                child.destroy();
            }
            parentInstance.removeChild(child);
        },
        removeChildFromContainer: (): void => {
            throw new Error('not implemented')
        },
        resetTextContent: (): void => undefined,
        hideInstance: (): void => undefined,
        hideTextInstance: (): void => undefined,
        unhideInstance: (): void => undefined,
        unhideTextInstance: (): void => undefined,
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
        clearContainer: (container): void => undefined,
        createFragmentInstance: null,
        updateFragmentInstanceFiber: null,
        commitNewChildToFragmentInstance: null,
        deleteChildFromFragmentInstance: null,

        // -------------------
        //      Microtasks
        //     (optional)
        // -------------------
        supportsMicrotasks: true,
        scheduleMicrotask:
            typeof queueMicrotask === 'function'
                ? queueMicrotask
                : typeof localPromise !== 'undefined'
                    ? (callback) => localPromise.resolve(null).then(callback).catch(handleErrorInNextTick)
                    : scheduleTimeout
        }

        // TODO
        // onUncaughtError: () => {},
    return hostConfig;
}


// -------------------
//      Test selectors
//     (optional)
// -------------------
/*
export const supportsTestSelectors = $$$config.supportsTestSelectors;
export const findFiberRoot = $$$config.findFiberRoot;
export const getBoundingRect = $$$config.getBoundingRect;
export const getTextContent = $$$config.getTextContent;
export const isHiddenSubtree = $$$config.isHiddenSubtree;
export const matchAccessibilityRole = $$$config.matchAccessibilityRole;
export const setFocusIfFocusable = $$$config.setFocusIfFocusable;
export const setupIntersectionObserver = $$$config.setupIntersectionObserver;
*/

// -------------------
//     Persistence
//     (optional)
// -------------------
/*
export const cloneInstance = $$$config.cloneInstance;
export const createContainerChildSet = $$$config.createContainerChildSet;
export const appendChildToContainerChildSet =
  $$$config.appendChildToContainerChildSet;
export const finalizeContainerChildren = $$$config.finalizeContainerChildren;
export const replaceContainerChildren = $$$config.replaceContainerChildren;
export const cloneHiddenInstance = $$$config.cloneHiddenInstance;
export const cloneHiddenTextInstance = $$$config.cloneHiddenTextInstance;
*/

// -------------------
//     Hydration
//     (optional)
// -------------------
/*
export const isSuspenseInstancePending = $$$config.isSuspenseInstancePending;
export const isSuspenseInstanceFallback = $$$config.isSuspenseInstanceFallback;
export const getSuspenseInstanceFallbackErrorDetails =
  $$$config.getSuspenseInstanceFallbackErrorDetails;
export const registerSuspenseInstanceRetry =
  $$$config.registerSuspenseInstanceRetry;
export const canHydrateFormStateMarker = $$$config.canHydrateFormStateMarker;
export const isFormStateMarkerMatching = $$$config.isFormStateMarkerMatching;
export const getNextHydratableSibling = $$$config.getNextHydratableSibling;
export const getNextHydratableSiblingAfterSingleton =
  $$$config.getNextHydratableSiblingAfterSingleton;
export const getFirstHydratableChild = $$$config.getFirstHydratableChild;
export const getFirstHydratableChildWithinContainer =
  $$$config.getFirstHydratableChildWithinContainer;
export const getFirstHydratableChildWithinActivityInstance =
  $$$config.getFirstHydratableChildWithinActivityInstance;
export const getFirstHydratableChildWithinSuspenseInstance =
  $$$config.getFirstHydratableChildWithinSuspenseInstance;
export const getFirstHydratableChildWithinSingleton =
  $$$config.getFirstHydratableChildWithinSingleton;
export const canHydrateInstance = $$$config.canHydrateInstance;
export const canHydrateTextInstance = $$$config.canHydrateTextInstance;
export const canHydrateActivityInstance = $$$config.canHydrateActivityInstance;
export const canHydrateSuspenseInstance = $$$config.canHydrateSuspenseInstance;
export const hydrateInstance = $$$config.hydrateInstance;
export const hydrateTextInstance = $$$config.hydrateTextInstance;
export const hydrateActivityInstance = $$$config.hydrateActivityInstance;
export const hydrateSuspenseInstance = $$$config.hydrateSuspenseInstance;
export const getNextHydratableInstanceAfterActivityInstance =
  $$$config.getNextHydratableInstanceAfterActivityInstance;
export const getNextHydratableInstanceAfterSuspenseInstance =
  $$$config.getNextHydratableInstanceAfterSuspenseInstance;
export const commitHydratedInstance = $$$config.commitHydratedInstance;
export const commitHydratedContainer = $$$config.commitHydratedContainer;
export const commitHydratedActivityInstance =
  $$$config.commitHydratedActivityInstance;
export const commitHydratedSuspenseInstance =
  $$$config.commitHydratedSuspenseInstance;
export const finalizeHydratedChildren = $$$config.finalizeHydratedChildren;
export const flushHydrationEvents = $$$config.flushHydrationEvents;
export const clearActivityBoundary = $$$config.clearActivityBoundary;
export const clearSuspenseBoundary = $$$config.clearSuspenseBoundary;
export const clearActivityBoundaryFromContainer =
  $$$config.clearActivityBoundaryFromContainer;
export const clearSuspenseBoundaryFromContainer =
  $$$config.clearSuspenseBoundaryFromContainer;
export const hideDehydratedBoundary = $$$config.hideDehydratedBoundary;
export const unhideDehydratedBoundary = $$$config.unhideDehydratedBoundary;
export const shouldDeleteUnhydratedTailInstances =
  $$$config.shouldDeleteUnhydratedTailInstances;
export const diffHydratedPropsForDevWarnings =
  $$$config.diffHydratedPropsForDevWarnings;
export const diffHydratedTextForDevWarnings =
  $$$config.diffHydratedTextForDevWarnings;
export const describeHydratableInstanceForDevWarnings =
  $$$config.describeHydratableInstanceForDevWarnings;
export const validateHydratableInstance = $$$config.validateHydratableInstance;
export const validateHydratableTextInstance =
  $$$config.validateHydratableTextInstance;
*/

// -------------------
//     Resources
//     (optional)
// -------------------
/*
export type HoistableRoot = mixed;
export type Resource = mixed;
export const supportsResources = $$$config.supportsResources;
export const isHostHoistableType = $$$config.isHostHoistableType;
export const getHoistableRoot = $$$config.getHoistableRoot;
export const getResource = $$$config.getResource;
export const acquireResource = $$$config.acquireResource;
export const releaseResource = $$$config.releaseResource;
export const hydrateHoistable = $$$config.hydrateHoistable;
export const mountHoistable = $$$config.mountHoistable;
export const unmountHoistable = $$$config.unmountHoistable;
export const createHoistableInstance = $$$config.createHoistableInstance;
export const prepareToCommitHoistables = $$$config.prepareToCommitHoistables;
export const mayResourceSuspendCommit = $$$config.mayResourceSuspendCommit;
export const preloadResource = $$$config.preloadResource;
export const suspendResource = $$$config.suspendResource;
*/

// -------------------
//     Singletons
//     (optional)
// -------------------
/*
export const supportsSingletons = $$$config.supportsSingletons;
export const resolveSingletonInstance = $$$config.resolveSingletonInstance;
export const acquireSingletonInstance = $$$config.acquireSingletonInstance;
export const releaseSingletonInstance = $$$config.releaseSingletonInstance;
export const isHostSingletonType = $$$config.isHostSingletonType;
export const isSingletonScope = $$$config.isSingletonScope;
*/
