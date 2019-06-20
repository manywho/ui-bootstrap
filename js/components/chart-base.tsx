import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IChartBaseProps from '../interfaces/IChartBaseProps';
import { Chart } from 'chart.js';
import { equals } from 'ramda';

import '../../css/chart.less';

declare var manywho: any;

class ChartBase extends React.Component<IChartBaseProps, null> {

    chart = null;
    displayName = 'ChartBase';

    constructor(props: any) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const element = this.chart.getElementAtEvent(e);
        const objectData = this.props.objectData;
        const internalId = objectData[element[0]._datasetIndex][element[0]._index].internalId;

        if (element && element.length > 0 && this.props.onClick)
            this.props.onClick(internalId, element[0]._datasetIndex);
    }

    updateChart() {
        if (this.props.isVisible === false)
            return;

        const chartSettings =
            manywho.settings.global('charts.' + this.props.type, this.props.flowKey, null);

        const backgroundColors = chartSettings && chartSettings.backgroundColors ?
            chartSettings.backgroundColors
            : manywho.settings.global('charts.backgroundColors', this.props.flowKey);

        const borderColors = chartSettings && chartSettings.borderColors ?
            chartSettings.borderColors
            : manywho.settings.global('charts.borderColors', this.props.flowKey);

        const data: any = {
            labels: [],
            datasets: [],
        };

        this.props.objectData.forEach((objectData, index) => {
            const dataset: any = {
                data: [],
                fill: false,
                backgroundColor: [],
                borderColor: [],
            };

            if (this.props.labels)
                dataset.label = this.props.labels[index];

            if (objectData) {
                objectData.forEach((objectDatum, rowIndex) => {

                    this.props.columns.forEach((column, columnIndex) => {

                        const property = objectDatum.properties.find(prop =>
                                manywho.utils.isEqual(
                                    prop.typeElementPropertyId, column.typeElementPropertyId,
                                ),
                            );

                        if (property)
                            switch (columnIndex) {

                            case 0:
                                if (index === 0)
                                    data.labels.push(property.contentValue);
                                break;

                            case 1:
                                dataset.data.push(property.contentValue);
                                break;

                            case 2:
                                let backgroundColor = property.contentValue;
                                if (manywho.utils.isNullOrWhitespace(property.contentValue))
                                    backgroundColor =
                                        backgroundColors[rowIndex % backgroundColors.length];

                                dataset.backgroundColor.push(backgroundColor);
                                break;

                            case 3:
                                let borderColor = property.contentValue;
                                if (manywho.utils.isNullOrWhitespace(property.contentValue))
                                    borderColor = borderColors[rowIndex % borderColors.length];

                                dataset.borderColor.push(borderColor);
                                break;
                            }
                    });

                    if (this.props.objectData.length > 1
                        && (this.props.type === 'bar' || this.props.type === 'line')) {

                        if (dataset.backgroundColor.length - 1 < rowIndex)
                            dataset.backgroundColor
                                .push(backgroundColors[index % backgroundColors.length]);

                        if (dataset.borderColor.length - 1 < rowIndex)
                            dataset.borderColor
                                .push(borderColors[index % borderColors.length]);
                    } else {
                        if (dataset.backgroundColor.length - 1 < rowIndex)
                            dataset.backgroundColor
                                .push(backgroundColors[rowIndex % backgroundColors.length]);

                        if (dataset.borderColor.length - 1 < rowIndex)
                            dataset.borderColor
                                .push(borderColors[rowIndex % borderColors.length]);
                    }
                });

                data.datasets.push(dataset);
            }
        });

        if (manywho.utils.isEqual(this.props.type, 'line', true)) {
            data.datasets = data.datasets.map((dataset, index) => {
                dataset.backgroundColor = backgroundColors[index];
                dataset.borderColor = dataset.backgroundColor;
                return dataset;
            });
        }

        const options = $.extend(
            {},
            manywho.settings.global('charts.options', this.props.flowKey, {}),
            (chartSettings && chartSettings.options) ? chartSettings.options : {},
            this.props.options,
        );

        if (this.chart) {
            this.chart.data.datasets = data.datasets;
            this.chart.data.labels = data.labels;
            this.chart.update();
        } else {
            const canvas = findDOMNode(this.refs['canvas']);

            this.chart = new Chart(canvas, {
                data,
                options,
                type: this.props.type,
            });
        }
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.isLoading && !prevProps.isLoading) || !equals(this.props.objectData, prevProps.objectData)) {
            this.updateChart();
        }
    }

    render() {
        return <canvas
            onClick={this.onClick}
            ref="canvas"
            width={this.props.width}
            height={this.props.height} />;
    }

}

manywho.component.register(registeredComponents.CHART_BASE, ChartBase);

export const getChartBase = () : typeof ChartBase => manywho.component.getByName(registeredComponents.CHART_BASE) || ChartBase;

export default ChartBase;
