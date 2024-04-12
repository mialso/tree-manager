import React from 'react';
import { useModuleLifecycle } from '../manager/hooks';

export const ServiceTwo = ({ children }) => {
    useModuleLifecycle('serviceTwo');
    return (
        <service name="serviceTwo">
            {children}
        </service>
    );
};
