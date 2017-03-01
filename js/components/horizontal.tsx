/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;
declare var ReactCollapse: any;

(function (manywho) {

    const horizontal = React.createClass({

        render: function () {
            const children = manywho.model.getChildren(this.props.id, this.props.flowKey);

            return <div className="row clearfix">
                {this.props.children || manywho.component.getChildComponents(children, this.props.id, this.props.flowKey)}
            </div>;
        }

    });

    manywho.component.registerContainer('horizontal_flow', horizontal);

    manywho.styling.registerContainer('horizontal_flow', (item, container) => {
        const columnSpan = Math.floor(12 / Math.max(1, container.childCount));
        return ['col-sm-' + columnSpan];
    });

} (manywho));
