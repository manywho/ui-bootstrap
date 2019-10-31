import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import { getWait } from './wait';
import { renderOutcomesInOrder } from './utils/CoreUtils';

import '../../css/list.less';

declare var manywho: any;

const List: React.SFC<IComponentProps> = ({ id, parentId, flowKey, isDesignTime }) => {

    const model = manywho.model.getComponent(id, flowKey);

    manywho.log.info(`Rendering List: ${id}, ${model.developerName}`);

    const state = manywho.state.getComponent(id, flowKey) || {};
    const outcomes = manywho.model.getOutcomes(id, flowKey);

    const Outcome = getOutcome();
    const Wait = getWait();

    let elements = null;
    let className = manywho.styling.getClasses(
        parentId,
        id,
        'list',
        flowKey,
    ).join(' ');

    if (model.isValid === false || state.isValid === false)
        className += ' has-error';

    if (model.isVisible === false)
        className += ' hidden';

    if (model.objectData && !isDesignTime) {
        const columnTypeElementPropertyId =
            manywho.component.getDisplayColumns(model.columns)[0].typeElementPropertyId;

        elements = model.objectData.map((element) => {

            const property =
                element.properties.find((prop) => {
                    return manywho.utils.isEqual(
                        prop.typeElementPropertyId,
                        columnTypeElementPropertyId,
                        true,
                    );
                });

            return (
                <li id={element.externalId} key={element.externalId}>
                    {
                        manywho.formatting.format(
                            property.contentValue,
                            property.contentFormat,
                            property.contentType,
                            flowKey,
                        )
                    }
                </li>
            );
        });
    } else if (isDesignTime) {
        elements = [
            <li key="list1">Item 1</li>,
            <li key="list2">Item 2</li>,
            <li key="list3">Item 3</li>,
        ];
    }

    let list = <ul>{elements}</ul>;

    if (
        model.attributes.ordered &&
        !manywho.utils.isEqual(model.attributes.ordered, 'false', true)
    ) {
        list = <ol>{elements}</ol>;
    }

    const outcomeButtons =
        outcomes && outcomes.map(outcome => <Outcome flowKey={flowKey} id={outcome.id} />);

    const listElement = (
        <div>
            <label>{model.label}</label>
            {list}
        </div>
    );

    return (
        <div className={className} id={id}>
            {renderOutcomesInOrder(listElement, outcomeButtons, outcomes, model.isVisible)}
            <Wait isVisible={state.loading} message={state.loading && state.loading.message} isSmall />
        </div>
    );
};

manywho.component.register(registeredComponents.LIST, List);

export const getList = () : typeof List => manywho.component.getByName(registeredComponents.LIST);

export default List;
