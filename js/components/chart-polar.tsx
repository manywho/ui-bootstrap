import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getChart } from './chart';


declare var manywho: any;

const ChartPolar: React.SFC<IComponentProps> = (props) => {

    const Chart = getChart();
    const chartProps: any = $.extend({}, props, {
        type: 'polarArea',
    });

    return <Chart {...chartProps} />;
};

manywho.component.registerItems(registeredComponents.CHART_POLAR, ChartPolar);

export const getChartPolar = () : typeof ChartPolar => manywho.component.getByName(registeredComponents.CHART_POLAR);

export default ChartPolar;
