import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getChart } from './chart';


declare var manywho: any;

const ChartDoughnut: React.SFC<IComponentProps> = (props) => {

    const Chart = getChart();

    const chartProps: any = $.extend({}, props, {
        type: 'doughnut',
    });

    return <Chart {...chartProps} />;
};

manywho.component.registerItems(registeredComponents.CHART_DOUGHNUT, ChartDoughnut);

export const getChartDoughnut = () : typeof ChartDoughnut => manywho.component.getByName(registeredComponents.CHART_DOUGHNUT) || ChartDoughnut;

export default ChartDoughnut;
