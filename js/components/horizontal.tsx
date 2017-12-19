import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

const Horizontal: React.SFC<IComponentProps> = ({ id, flowKey, children }) => {

    const childData = manywho.model.getChildren(id, flowKey);

    return <div className="row clearfix" id="horizontal">
        {children || manywho.component.getChildComponents(childData, id, flowKey)}
    </div>;
};

manywho.component.registerContainer(registeredComponents.HORIZONTAL, Horizontal);

manywho.styling.registerContainer('horizontal_flow', (item, container) => {
    const columnSpan = Math.floor(12 / Math.max(1, container.childCount));
    return ['col-sm-' + columnSpan];
});

export const getHorizontal = () : typeof Horizontal => manywho.component.getByName(registeredComponents.HORIZONTAL);

export default Horizontal;
