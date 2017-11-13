/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IChartComponentProps.ts" />

declare var manywho: any;
declare var Chart: any;

/* tslint:disable-next-line:variable-name */
const ChartComponent: React.SFC<IChartComponentProps> = (
    { id, flowKey, parentId, isDesignTime, contentElement, outcomes,
        objectData, options, isLoading, onOutcome, type, refresh },
) => {

    const onClick = (externalId) => {
        const outcome = outcomes.filter(item => !item.isBulkAction)[0];

        if (outcome)
            onOutcome(externalId, outcome.id);
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
    if (!isDesignTime)
        headerElement = React.createElement(manywho.component.getByName('mw-items-header'), {
            flowKey,
            refresh,
            isSearchable: false,
            isRefreshable: (model.objectDataRequest || model.fileDataRequest),
            outcomes: manywho.model.getOutcomes(id, flowKey),
            isEnabled: model.isEnabled,
        });

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

    if (!contentElement || isDesignTime)
        contentElement = React.createElement(
            manywho.component.getByName('mw-chart-base'), 
            {
                columns,
                flowKey,
                type,
                options,
                isLoading,
                isVisible: model.isVisible,
                objectData: objectDataList,
                onClick: !isDesignTime ? this.onClick : null,
                width: model.width > 0 ? model.width : undefined,
                height: model.height > 0 ? model.height : undefined,
            }, 
            null,
        );

    let validationElement = null;
    if (typeof model.isValid !== 'undefined' && model.isValid === false)
        validationElement = <div className="has-error">
            <span className="help-block">{model.validationMessage}</span>
        </div>;

    return <div className={className} id={id}>
        {labelElement}
        {headerElement}
        {contentElement}
        {validationElement}
        <span className="help-block">{model.validationMessage}</span>
        <span className="help-block">{model.helpInfo}</span>
        {
            React.createElement(
                manywho.component.getByName('wait'), 
                { 
                    isVisible: isLoading, 
                    message: state.loading && state.loading.message, 
                    isSmall: true,
                }, 
                null,
            )
        }
    </div>;
};

manywho.component.register('mw-chart', ChartComponent);
