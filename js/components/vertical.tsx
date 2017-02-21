/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    const vertical = React.createClass({

        render: function () {
            const children = manywho.model.getChildren(this.props.id, this.props.flowKey);

            return <div className="clearfix">
                {this.props.children || manywho.component.getChildComponents(children, this.props.id, this.props.flowKey)}
            </div>;
        }

    });

    manywho.component.registerContainer('vertical_flow', vertical);

    manywho.styling.registerContainer('vertical_flow', (item, container) => {
        const classes = [];

        if (manywho.utils.isEqual(item.componentType, 'input', true)
            && item.size === 0
            && (manywho.utils.isEqual(item.contentType, manywho.component.contentTypes.string, true)
                || manywho.utils.isEqual(item.contentType, manywho.component.contentTypes.password, true)
                || manywho.utils.isEqual(item.contentType, manywho.component.contentTypes.number, true))) {

            classes.push('auto-width');

        }

        return classes;
    });

} (manywho));
