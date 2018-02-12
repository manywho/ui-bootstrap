import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';

declare var manywho: any;

const notFoundWrapper = (componentType) => {
    return () => <div style={{ color: 'red' }}>
        { `Component of type: "${componentType}" could not be found` }
    </div>;
};

manywho.component.register(registeredComponents.NOT_FOUND, notFoundWrapper);
