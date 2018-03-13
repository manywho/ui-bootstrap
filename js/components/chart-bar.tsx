import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getChart } from './chart';

declare var manywho: any;

const ChartBar: React.SFC<IComponentProps> = (props) => {

    const { id, flowKey } = props;
    const model = manywho.model.getComponent(id, flowKey);
    const Chart = getChart();

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

    return <Chart {...chartProps} />;
};

manywho.component.registerItems(registeredComponents.CHART_BAR, ChartBar);

export const getChartBar = () : typeof ChartBar => manywho.component.getByName(registeredComponents.CHART_BAR) || ChartBar;

export default ChartBar;
