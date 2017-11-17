import IItemsComponentProps from '../interfaces/IItemsComponentProps';

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const ChartBar: React.SFC<IItemsComponentProps> = (props) => {

    const { id, parentId, flowKey } = props;
    const model = manywho.model.getComponent(id, flowKey);
    let label = null;

    if (model.attributes)
        label = model.attributes.label;

    const chartProps: any = $.extend({}, props, {
        type: 'bar',
        options: {
            legend: {
                display: !manywho.utils.isNullOrWhitespace(label),
            },
        },
    });

    return React.createElement(manywho.component.getByName('mw-chart'), chartProps, null);
};

manywho.component.registerItems('chart-bar', ChartBar);

export default ChartBar;
