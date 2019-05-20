import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IChartComponentProps from '../interfaces/IChartComponentProps';
import { getItemsHeader } from './items-header';
import { getChartBase } from './chart-base';
import { getWait } from './wait';

declare var manywho: any;

const ChartComponent: React.SFC<IChartComponentProps> = (
    { id, flowKey, parentId, isDesignTime, contentElement, outcomes,
        objectData, options, isLoading, onOutcome, type, refresh },
) => {

    const ItemsHeader = getItemsHeader();
    const ChartBase = getChartBase();
    const Wait = getWait();

    const onClick = (internalId) => {
        const outcome = outcomes.filter(item => !item.isBulkAction)[0];

        if (outcome)
            onOutcome(internalId, outcome.id);
    };

    const model = manywho.model.getComponent(id, flowKey);

    manywho.log.info(`Rendering Chart: ${model.developerName}, ${id}`);

    const state = 
        isDesignTime ? 
            { error: null, loading: false } : 
            manywho.state.getComponent(id, flowKey) || {};

    let columns = manywho.component.getDisplayColumns(model.columns) || [];

    let className = manywho.styling.getClasses(
        parentId, id, 'chart', flowKey,
    ).join(' ');

    if (model.isVisible === false)
        className += ' hidden';

    if (model.attributes && model.attributes.classes)
        className += ' ' + model.attributes.classes;

    let labelElement = null;
    if (!manywho.utils.isNullOrWhitespace(model.label))
        labelElement = <label>{model.label}</label>;

    let headerElement = null;

    if (!isDesignTime) {
        const headerProps = {
            flowKey,
            refresh,
            isSearchable: false,
            isRefreshable: (model.objectDataRequest || model.fileDataRequest),
            outcomes: manywho.model.getOutcomes(id, flowKey),
            isEnabled: model.isEnabled,
        };

        headerElement = <ItemsHeader {...headerProps} />;
    }

    let objectDataList = [objectData];

    if (isDesignTime) {
        objectDataList = [
            [
                Math.random() * 10, 
                Math.random() * 15, 
                Math.random() * 50, 
                Math.random() * 25,
            ]
            .map((item, index) => {
                return {
                    properties: [
                        { contentValue: 'Label ' + index, typeElementPropertyId: 'id' },
                        { contentValue: item, typeElementPropertyId: 'id1' },
                    ],
                };
            }),
        ];

        columns = [{ typeElementPropertyId: 'id' }, { typeElementPropertyId: 'id1' }];
    }

    let content = contentElement;

    if (!content || isDesignTime) {

        const chartProps = {
            columns,
            flowKey,
            type,
            options,
            isLoading,
            isVisible: model.isVisible,
            objectData: objectDataList,
            onClick: !isDesignTime ? onClick : null,
            width: model.width > 0 ? model.width : undefined,
            height: model.height > 0 ? model.height : undefined,
        };

        content = <ChartBase {...chartProps} />;
    }

    let validationElement = null;
    if (typeof model.isValid !== 'undefined' && model.isValid === false)
        validationElement = <div className="has-error">
            <span className="help-block">{model.validationMessage}</span>
        </div>;

    return <div className={className} id={id}>
        {labelElement}
        {headerElement}
        {content}
        {validationElement}
        <span className="help-block">{model.validationMessage}</span>
        <span className="help-block">{model.helpInfo}</span>
        <Wait isVisible={isLoading} message={state.loading && state.loading.message} isSmall={true} />
    </div>;
};

manywho.component.register(registeredComponents.CHART, ChartComponent);

export const getChart = () : typeof ChartComponent => manywho.component.getByName(registeredComponents.CHART) || ChartComponent;

export default ChartComponent;
