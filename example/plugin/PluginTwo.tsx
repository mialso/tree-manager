import React from 'react';
import { useModuleLifecycle } from '../hooks';

export const PluginTwo = ({ data, children }) => {
    useModuleLifecycle('pluginTwo');
    if (data.status !== 'READY') {
        return null;
    }
    return (
        <plugin name="pluginTwo">
            {children}
        </plugin>
    );
};
