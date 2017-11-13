/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;
declare var ReactCollapse: any;

(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Horizontal: React.SFC<IComponentProps> = ({ id, flowKey }) => {

        const children = manywho.model.getChildren(id, flowKey);

        return <div className="row clearfix">
            {children || manywho.component.getChildComponents(children, id, flowKey)}
        </div>;
    };

    manywho.component.registerContainer('horizontal_flow', Horizontal);

    manywho.styling.registerContainer('horizontal_flow', (item, container) => {
        const columnSpan = Math.floor(12 / Math.max(1, container.childCount));
        return ['col-sm-' + columnSpan];
    });

} (manywho));
