import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

const Inline: React.SFC<IComponentProps> = ({ id, parentId, flowKey, children }) => {

    const childData = manywho.model.getChildren(id, flowKey);

    return <div className="clearfix">
        {
            children ||
            manywho.component.getChildComponents(childData, id, flowKey)
        }
    </div>;
};

manywho.component.registerContainer(registeredComponents.INLINE, Inline);

manywho.styling.registerContainer('inline_flow', (item, container) => {
    return ['pull-left'];
});

export const getInline = () : typeof Inline => manywho.component.getByName(registeredComponents.INLINE);

export default Inline;
