import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IItemsComponentProps from '../interfaces/IItemsComponentProps';
import { getChart } from './chart';

declare var manywho: any;

const ChartLine: React.SFC<IItemsComponentProps> = (props) => {

    const Chart = getChart();
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

    return <Chart {...chartProps} />;
};

manywho.component.registerItems(registeredComponents.CHART_LINE, ChartLine);

export const getChartLine = () : typeof ChartLine => manywho.component.getByName(registeredComponents.CHART_LINE);

export default ChartLine;
