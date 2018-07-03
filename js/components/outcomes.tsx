import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';

import '../../css/outcomes.less';

declare var manywho: any;

class Outcomes extends React.Component<IComponentProps, null> {

    displayName: 'Outcomes';

    constructor(props: IComponentProps) {
        super(props);

        this.handleEvent = this.handleEvent.bind(this);
    }

    handleEvent(e) {
        manywho.component.handleEvent(
            this, 
            manywho.model.getComponent(this.props.id, this.props.flowKey), 
            this.props.flowKey,
        );
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Outcomes: ${this.props.id}, ${model.developerName}`);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        const Outcome = getOutcome();

        let className = manywho.styling.getClasses(
            this.props.parentId, this.props.id, 'outcomes', this.props.flowKey,
        ).join(' ');

        if (model.isValid === false || state.isValid === false)
            className += ' has-error';

        if (model.isVisible === false)
            className += ' hidden';

        let rowClassName = 'row';
        let groupClassName = '';

        if (model.attributes) {
            if (!manywho.utils.isNullOrWhitespace(model.attributes.justify))
                rowClassName += ' justify-' + model.attributes.justify;

            if (manywho.utils.isEqual(model.attributes.group, 'horizontal', true))
                groupClassName += ' btn-group';

            if (manywho.utils.isEqual(model.attributes.group, 'vertical', true))
                groupClassName += ' btn-group-vertical';

            if (!manywho.utils.isNullOrWhitespace(model.attributes.columns))
                rowClassName += ' block';
        }

        const outcomes: any[] = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        let size = 'default';
        if (model.attributes && !manywho.utils.isNullOrWhitespace(model.attributes.size))
            size = model.attributes.size;

        let outcomeElements: JSX.Element[] = outcomes && outcomes
            .map((outcome) => {
                const element = 
                    <Outcome size={size} id={outcome.id} className={model.attributes.outcomeClasses} 
                        disabled={!model.isEnabled} flowKey={this.props.flowKey} />;

                if (
                    model.attributes && 
                    !manywho.utils.isNullOrWhitespace(model.attributes.columns)
                ) {
                    return <div className={'column col-' + model.attributes.columns} key={outcome.id}>
                        {element}
                    </div>;
                }

                return element;
            });

        if (this.props.isDesignTime)
            outcomeElements = [
                <button className="btn btn-primary outcome" key="outcome1">Outcome 1</button>,
                <button className="btn btn-success outcome" key="outcome2">Outcome 2</button>,
                <button className="btn btn-danger outcome" key="outcome3">Outcome 3</button>,
            ];

        if (!manywho.utils.isNullOrWhitespace(model.attributes.group))
            outcomeElements = [<div className={groupClassName} key="outcomes">{outcomeElements}</div>];

        return <div className={className} id={this.props.id}>
            <label>{model.label}</label>
            <div className={rowClassName}>
                {outcomeElements}
            </div>
            <span className="help-block">{model.validationMessage || state.validationMessage}</span>
            <span className="help-block">{model.helpInfo}</span>
        </div>;
    }
}

manywho.component.register(registeredComponents.OUTCOMES, Outcomes);

export const getOutcomes = () : typeof Outcomes => manywho.component.getByName(registeredComponents.OUTCOMES);

export default Outcomes;
