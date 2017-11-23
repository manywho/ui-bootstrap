import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import { getWait } from './wait';

import '../../css/list.less';

declare var manywho: any;

class List extends React.Component<IComponentProps, null> {

    displayName: 'List';

    constructor(props: IComponentProps) {
        super(props);
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering List: ${this.props.id}, ${model.developerName}`);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const Outcome = getOutcome();
        const Wait = getWait();

        let elements = null;
        let className = manywho.styling.getClasses(
            this.props.parentId, 
            this.props.id, 
            'list', 
            this.props.flowKey,
        ).join(' ');

        if (model.isValid === false || state.isValid === false)
            className += ' has-error';

        if (model.isVisible === false)
            className += ' hidden';

        if (model.objectData && !this.props.isDesignTime) {
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
                                this.props.flowKey,
                            )
                        }
                    </li>
                );
            });
        } else if (this.props.isDesignTime) {
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
            outcomes && outcomes.map((outcome) => {
                return React.createElement(
                    manywho.component.getByName('outcome'), 
                    { id: outcome.id, flowKey: this.props.flowKey },
                );
            });

        return <div className={className} id={this.props.id}>
            <label>{model.label}</label>
            {list}
            {outcomeButtons}
            <Wait isVisible={state.loading} message={state.loading && state.loading.message} isSmall={true} />
        </div>;
    }

}

manywho.component.register(registeredComponents.LIST, List);

export const getList = () : typeof List => manywho.component.getByName(registeredComponents.LIST);

export default List;
