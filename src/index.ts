import React from 'react';
import { NewRoot } from './Root';
import { createReconciler } from './moduleRenderer';
import { createElement } from './manager/element';
import { dispatch } from './bus/messageBus';
import { TREE_MOUNT } from './bus/message';

const renderer = createReconciler();
const rootElement = createElement('root', {});
// const rootElement = createElement('root', {}, { dispatch: () => { console.info('ROOT'); } });
const container = renderer.createContainer(rootElement, false, false);
const parentComponent = null;
renderer.updateContainer(
    React.createElement(NewRoot),
    container,
    parentComponent,
    () => {
        console.info(`[DDD---] ${new Date().getSeconds()}`);
        dispatch(TREE_MOUNT);
    },
);
