import * as React from 'react';

declare var manywho: any;

const Dynamic: React.SFC<{ name: string; props: any; }> = ({ name, props }) => {
    const Component = manywho.component.getByName(name);
    
    if (typeof Component !== 'undefined') {
        Component.displayName = name;
    }

    return Component ? React.createElement(Component, props) : <noscript />;
};

export default Dynamic;
