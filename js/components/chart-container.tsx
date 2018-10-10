import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import { getErrorFallback } from './error-fallback';
import IChartContainerProps from '../interfaces/IChartContainerProps';
import { getChartBase } from './chart-base';
import { getWait } from './wait';

declare var manywho: any;

class ChartContainer extends React.Component<IChartContainerProps> {

    state = {
        error: null,
        componentStack: null,
        hasError: false,
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidCatch(error, { componentStack }) {
        this.setState({ 
            error,
            componentStack,
            hasError: true,
        });
    }

    onClick(externalId, index) {
        const { id, flowKey } = this.props;
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
    }

    onRefresh() {
        const { id, flowKey } = this.props;
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
    }

    render() {

        const {
            error,
            componentStack,
            hasError,
        } = this.state;
        
        const ErrorFallback = getErrorFallback();
        
        if (hasError) {
            return <ErrorFallback error={error} componentStack={componentStack} />;
        }

        const {
            id,
            flowKey,
            isDesignTime,
            children,
        } = this.props;
    
        const model = manywho.model.getContainer(id, flowKey);

        if (isDesignTime)

            // When in design time it does not matter
            // if children just returns an empty array
            // Note: chart containers parent component is
            // always the container wrapper component inside the tooling
            return <div className="clearfix">
                {children}
            </div>;

        let chartContainerChildren = children;

        // This components child components (e.g bar charts etc) 
        // should be passed down from the parent component
        // if not then try to retrieve child components from the model
        if (!chartContainerChildren)
            chartContainerChildren = manywho.model.getChildren(id, flowKey);

        const models = chartContainerChildren.map(item => 
            manywho.model.getComponent(item.id, flowKey));

        const states = chartContainerChildren.map(item => 
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
            ((model.objectDataRequest || model.fileDataRequest)) ?
            <button className="btn btn-sm btn-default pull-right" onClick={this.onRefresh}>
                <span className="glyphicon glyphicon-refresh" />
            </button>
            : null;

        const objectData = models.map(item => item.objectData);    

        const ChartBase = getChartBase();
        const chartBaseProps = {
            options,
            objectData,
            columns,
            flowKey,
            isVisible: model.isVisible,
            labels: models.map(item => item.label),
            type: types[models[0].componentType],
            onClick: !isDesignTime ? this.onClick : null,
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
    }
}

manywho.component.registerContainer(registeredComponents.CHART_CONTAINER, ChartContainer);

export const getChartContainer = () : typeof ChartContainer => manywho.component.getByName(registeredComponents.CHART_CONTAINER) || ChartContainer;

export default ChartContainer;
