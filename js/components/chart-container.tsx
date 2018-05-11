import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IChartComponentProps from '../interfaces/IChartComponentProps';
import { getChartBase } from './chart-base';
import { getWait } from './wait';

declare var manywho: any;

const ChartContainer: React.SFC<IChartComponentProps> = ({ id, flowKey, children, isDesignTime }) => {

    const onClick = (externalId, index) => {
        const children = manywho.model.getChildren(id, flowKey);
        const outcomes = manywho.model.getOutcomes(children[index].id, flowKey);
        const outcome = outcomes && outcomes.find(item => !item.isBulkAction);

        if (outcome) {
            const model = manywho.model.getComponent(children[index].id, flowKey);
            const objectData = manywho.component.getSelectedRows(model, [externalId]);

            manywho.state.setComponent(
                children[index].id, 
                { objectData }, 
                flowKey, 
                true,
            );

            manywho.component.onOutcome(outcome, objectData, flowKey);
        }
    };

    const onRefresh = () => {
        const children = manywho.model.getChildren(id, flowKey);
        const models = children.map(item => 
            manywho.model.getComponent(item.id, flowKey));

        models
            .filter(model => model.objectDataRequest || model.fileDataRequest)
            .forEach((model) => {
                if (model.objectDataRequest)
                    manywho.engine.objectDataRequest(
                        model.id, 
                        model.objectDataRequest, 
                        flowKey, 
                        -1, null,  null, null, 1,
                    );
                else if (model.fileDataRequest)
                    manywho.engine.fileDataRequest(
                        model.id, 
                        model.fileDataRequest, 
                        flowKey, 
                        -1, null, null, null, 1,
                    );
            });
    };

    const model = manywho.model.getContainer(id, flowKey);
    // const children = manywho.model.getChildren(id, flowKey);

    if (isDesignTime)
        return <div className="clearfix">
            {
                children
            }
        </div>;

    const models = children.map(item => 
        manywho.model.getComponent(item.id, flowKey));

    const states = children.map(item => 
        manywho.state.getComponent(item.id, flowKey));

    const columns = manywho.component.getDisplayColumns(models[0].columns) || [];
    const isLoading = states.filter(state => state.loading).length > 0;
    const types = {
        'chart-bar': 'bar',
        'chart-line': 'line',
        'chart-pie': 'pie',
        'chart-doughnut': 'doughnut',
        'chart-polar': 'polarArea',
    };

    const options = {};

    const refreshButton = 
        ((model.objectDataRequest || model.fileDataRequest) && !isDesignTime) ?
        <button className="btn btn-sm btn-default pull-right" onClick={onRefresh}>
            <span className="glyphicon glyphicon-refresh" />
        </button>
        : null;

    let objectData = models.map(item => item.objectData);    
    if (isDesignTime)
        objectData = models.map((item) => {
            return [
                Math.random() * 10, 
                Math.random() * 15, 
                Math.random() * 50, 
                Math.random() * 25]
                    .map((data) => {
                        return {
                            properties: [
                                { 
                                    contentValue: columns[0].label, 
                                    typeElementPropertyId: columns[0].typeElementPropertyId, 
                                },
                                { 
                                    contentValue: data, 
                                    typeElementPropertyId: columns[1].typeElementPropertyId, 
                                },
                            ],
                        };
                    });
        });

    const ChartBase = getChartBase();
    const chartBaseProps = {
        options,
        objectData,
        columns,
        flowKey,
        isVisible: model.isVisible,
        labels: models.map(item => item.label),
        type: types[models[0].componentType],
        onClick: !isDesignTime ? onClick : null,
        width: models[0].width > 0 ? models[0].width : undefined,
        height: models[0].height > 0 ? models[0].height : undefined,
    };

    const Wait = getWait();

    return <div>
        {refreshButton}
        {
            <ChartBase {...chartBaseProps} />
        }
        {
            <Wait isVisible={isLoading} isSmall={true} />
        }
    </div>;
};

manywho.component.registerContainer(registeredComponents.CHART_CONTAINER, ChartContainer);

export const getChartContainer = () : typeof ChartContainer => manywho.component.getByName(registeredComponents.CHART_CONTAINER) || ChartContainer;

export default ChartContainer;
