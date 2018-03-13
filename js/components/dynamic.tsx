import * as React from 'react';

declare var manywho: any;

const Dynamic: React.SFC<{ name: string; props: any; }> = ({ name, props }) => {
    const component = manywho.component.getByName(name);

    return component ? React.createElement(component, props) : <noscript />;
};

export default Dynamic;
