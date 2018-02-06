import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getChart } from './chart';

declare var manywho: any;

const ChartPie: React.SFC<IComponentProps> = (props) => {

    const Chart = getChart();
    const chartProps: any = $.extend({}, props, {
        type: 'pie',
    });

    return <Chart {...chartProps} />;
};

manywho.component.registerItems(registeredComponents.CHART_PIE, ChartPie);

export const getChartPie = () : typeof ChartPie => manywho.component.getByName(registeredComponents.CHART_PIE);

export default ChartPie;
