/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Vertical: React.SFC<IComponentProps> = ({ id, children, flowKey }) => {

        const kids = manywho.model.getChildren(id, flowKey);

        return <div className="clearfix">
            {children || manywho.component.getChildComponents(kids, id, flowKey)}
        </div>;
    };

    manywho.component.registerContainer('vertical_flow', Vertical);
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

} (manywho));
