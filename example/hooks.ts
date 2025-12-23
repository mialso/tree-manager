import React from 'react';
import { dispatch } from './bus/messageBus';
import { MODULE_MOUNT, MODULE_UNMOUNT } from './bus/message';

export function useModuleLifecycle(moduleId) {
    React.useEffect(() => {
        dispatch(`${MODULE_MOUNT}_${moduleId}`);
        return () => {
            dispatch(`${MODULE_UNMOUNT}_${moduleId}`);
        };
    }, []);
}

export function useModuleInitTimeout(msec, setState) {
    React.useEffect(() => {
        setTimeout(() => {
            console.info(`[DDD---] init: ${msec}: READY: ${new Date().getSeconds()}`);
            setState({ status: 'READY' });
        }, msec);
        setTimeout(() => {
            console.info(`[DDD---] init: ${msec * 2}: NOT_READY: ${new Date().getSeconds()}`);
            setState({ status: 'NOT_READY' });
        }, msec * 2);
        return () => {
            setState({ status: 'NOT_READY' });
        };
    }, [msec, setState]);
}

export function useModuleStatusTimeout(msec, setState, statuses) {
    React.useEffect(() => {
        setTimeout(() => {
            console.info(`[DDD] SET_STATUS: ${msec}: ${new Date().getSeconds()}`);
            setState({ status: statuses[1] });
        }, msec);
        setTimeout(() => {
            console.info(`[DDD] SET_STATUS: ${msec * 2}: ${new Date().getSeconds()}`);
            setState({ status: statuses[2] });
        }, msec * 2);
        setTimeout(() => {
            console.info(`[DDD] SET_STATUS: ${msec * 3}: ${new Date().getSeconds()}`);
            setState({ status: statuses[0] });
        }, msec * 3);
        setTimeout(() => {
            console.info(`[DDD] SET_STATUS: ${msec * 4}: ${new Date().getSeconds()}`);
            setState({ status: statuses[3] });
        }, msec * 3);
        return () => {
            //setState({ status: statuses[0] });
        };
    // }, [msec, setState, statuses]);
    }, []);
}
