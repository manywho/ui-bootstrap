import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const Inline: React.SFC<IComponentProps> = ({ id, parentId, flowKey, children }) => {

    const childData = manywho.model.getChildren(id, flowKey);

    return <div className="clearfix">
        {
            children ||
            manywho.component.getChildComponents(childData, id, flowKey)
        }
    </div>;
};

manywho.component.registerContainer('inline_flow', Inline);

manywho.styling.registerContainer('inline_flow', (item, container) => {
    return ['pull-left'];
});

export default Inline;
