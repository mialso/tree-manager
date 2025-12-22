import React from 'react';
import { useModuleLifecycle } from '../hooks';

export const ServiceThree = () => {
    useModuleLifecycle('serviceThree');
    return (
        <service name="serviceThree" />
    );
};
