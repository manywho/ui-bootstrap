import IItemsComponentProps from '../interfaces/IItemsComponentProps';

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const ChartPie: React.SFC<IItemsComponentProps> = (props) => {

    const chartProps: any = $.extend({}, props, {
        type: 'pie',
    });

    return React.createElement(manywho.component.getByName('mw-chart'), chartProps, null);
};

manywho.component.registerItems('chart-pie', ChartPie);

export default ChartPie;
