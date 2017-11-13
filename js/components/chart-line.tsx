/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IItemsComponentProps.ts" />

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const ChartLine: React.SFC<IItemsComponentProps> = (props) => {

    const model = manywho.model.getComponent(props.id, props.flowKey);
    let label = null;

    if (model.attributes)
        label = model.attributes.label;

    const chartProps: any = $.extend({}, props, {
        type: 'line',
        options: {
            legend: {
                display: !manywho.utils.isNullOrWhitespace(label),
            },
        },
    });

    return React.createElement(manywho.component.getByName('mw-chart'), chartProps, null);
};

manywho.component.registerItems('chart-line', ChartLine);
