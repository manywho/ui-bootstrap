import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

const Vertical: React.SFC<IComponentProps> = ({ id, children, flowKey }) => {

    const kids = manywho.model.getChildren(id, flowKey);

    return <div className="clearfix">
        {children || manywho.component.getChildComponents(kids, id, flowKey)}
    </div>;
};

manywho.component.registerContainer(registeredComponents.VERTICAL, Vertical);
manywho.styling.registerContainer('vertical_flow', (item, container) => {
    const classes = [];

    if (manywho.utils.isEqual(item.componentType, 'input', true)
            && item.size === 0 &&
            (
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.string, true,
                ) ||
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.password, true,
                ) ||
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.number, true,
                )
            )
        ) {
        classes.push('auto-width');

    }

    return classes;
});

export const getVertical = () : typeof Vertical => manywho.component.getByName(registeredComponents.VERTICAL);

export default Vertical;
