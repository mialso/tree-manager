import React from 'react';
import { useModuleLifecycle, useModuleInitTimeout, useModuleStatusTimeout } from './hooks';
import { PluginOne } from './plugin/PluginOne';
import { PluginTwo } from './plugin/PluginTwo';
import { ServiceOne } from './one/ServiceOne';
import { ServiceTwo } from './two/ServiceTwo';
import { ServiceThree } from './two/ServiceThree';

/*
export const ModuleTwo = () => {
    const [moduleTwoState, setModuleTwoState] = React.useState({ data: 'modeleTwo', status: 'READY' });
    useModuleLifecycle('moduleTwo');
    return (
        <module name="moduleTwo">
            <PluginTwo moduleTwoData={moduleTwoState} setModuleTwoState={setModuleTwoState} />
        </module>
    );
};
*/

export const ModuleOne = ({ children }) => {
    useModuleLifecycle('moduleOne');
    return (
        <module name="moduleOne">
            {children}
        </module>
    );
};

export const OldRoot = () => {
    useModuleLifecycle('oldRoot');
    const [rootState, setRootState] = React.useState({ status: 'NOT_READY' });
    useModuleInitTimeout(1000, setRootState);
    return (
        <ModuleOne>
            <ServiceTwo>
                <ServiceOne>
                    { rootState.status === 'READY' && <PluginOne data={{}} /> }
                </ServiceOne>
            </ServiceTwo>
            <PluginTwo data={rootState}>
                <ServiceThree />
            </PluginTwo>
        </ModuleOne>
    );
};

export const Switch = ({status, children}) => {
    let element, match
    React.Children.forEach(children, (child) => {
        if (match) {
            return
        }
        element = child
        if (child.props.status === status) {
            match = true
        }

    })
    return match
        // ? React.Children.only(element.children)
        ? element
        : null
}

enum EntryStatus {
    ERROR = 'ENTRY_ERROR',
    LOADING  = 'ENTRY_LOADING',
    READY = 'ENTRY_READY',
    OFF = 'OFF',
}

export const Entry = ({children}) => {
    useModuleLifecycle('Entry');
    return (
        <module name="ENTRY">{children}</module>
    )
}

export const EntryErrorPage = () => {
    useModuleLifecycle('EntryErrorPage');
    return (
        <plugin name="EntryErrorPage" />
    )
}

export const SpinnerPage = () => {
    useModuleLifecycle('SpinnerPage');
    return (
        <plugin name="SpinnerPage" />
    )
}

export const AppCore = ({children}) => {
    useModuleLifecycle('AppCore');
    return (
        <module name="AppCore">
            <ServiceTwo>
                {children}
            </ServiceTwo>
        </module>
    )
}

const STATUSES_CHAIN = [EntryStatus.ERROR, EntryStatus.LOADING, EntryStatus.READY, EntryStatus.OFF];

export const NewRoot = () => {
    const [entryStatusState, setEntryStatus] = React.useState({ status: EntryStatus.LOADING });
    console.info('[NEW_ROOT]: (render): <statusState>: %s', entryStatusState)
    const updateStatus = React.useCallback(
        ({ status }) => {
            console.info('[NEW_ROOT]: (update): <NEW STATUS>: %s', status)
            setEntryStatus({ status })
        },
        [setEntryStatus],
    )
    useModuleStatusTimeout(7000, updateStatus, STATUSES_CHAIN);
    if (entryStatusState.status === EntryStatus.OFF) {
        return null
    }
    return (
        <Entry>
            <Switch status={entryStatusState.status}>
                <control-state status={EntryStatus.ERROR}>
                    <EntryErrorPage />
                </control-state>
                <control-state status={EntryStatus.LOADING}>
                    <SpinnerPage />
                </control-state>
                <control-state status={EntryStatus.READY}>
                    <AppCore>
                        <OldRoot />
                    </AppCore>
                </control-state>
            </Switch>
        </Entry>
    )
}
