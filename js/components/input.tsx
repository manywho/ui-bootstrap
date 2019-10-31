

import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getInputDateTime } from './input-datetime';
import { getInputBoolean } from './input-boolean';
import { getInputNumber } from './input-number';
import { getOutcome } from './outcome';
import { renderOutcomesInOrder } from './utils/CoreUtils';

import '../../css/input.less';

// react-maskedinput v4.0.1 has messed up default exports
// https://github.com/insin/react-maskedinput/issues/104
let MaskedInput = require('react-maskedinput');

if (MaskedInput.default) {
    MaskedInput = MaskedInput.default;
}

declare const manywho: any;

const Test = Comp => <Comp />;

class Input extends React.Component<IComponentProps, null> {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillMount() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        if (model && model.attributes && model.attributes.validation) {
            this.validationRegex = new RegExp(model.attributes.validation);
        }
    }

    onChange(e: any | string | boolean | number | null) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        if (
            typeof e === 'string' ||
            typeof e === 'boolean' ||
            typeof e === 'number' ||
            e === null
        ) {
            manywho.state.setComponent(
                this.props.id, { contentValue: e }, this.props.flowKey, true,
            );
        } else {
            manywho.state.setComponent(
                this.props.id,
                { contentValue: (e.target as HTMLInputElement).value },
                this.props.flowKey,
                true,
            );
        }

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        manywho.state.setComponent(
            this.props.id,
            manywho.validation.validate(model, state, this.props.flowKey),
            this.props.flowKey,
            true,
        );

        if (model.contentType.toUpperCase() === manywho.component.contentTypes.boolean) {
            this.onBlur(e);
        }

        this.forceUpdate();
    }

    onBlur(e) {
        let callback = null;
        const relatedElement = e.relatedTarget;

        if (
            relatedElement &&
            (
                relatedElement.classList.contains('outcome') ||
                relatedElement.classList.contains('control-label')
            )
        ) {
            callback = () => relatedElement.click();
        }

        manywho.component.handleEvent(
            this,
            manywho.model.getComponent(
                this.props.id,
                this.props.flowKey,
            ),
            this.props.flowKey,
            callback,
        );
    }

    validationRegex: RegExp;

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Input: ${model.developerName}, ${this.props.id}`);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const InputDateTime = getInputDateTime();
        const InputBoolean = getInputBoolean();
        const InputNumber = getInputNumber();
        const Outcome = getOutcome();

        const contentValue =
            !manywho.utils.isNullOrUndefined(state.contentValue)
                ? state.contentValue
                : model.contentValue || '';

        let mask = null;
        if (model.attributes && model.attributes.mask) {
            mask = model.attributes.mask;
        }

        let autocomplete = null;
        if (model.attributes && model.attributes.autocomplete) {
            autocomplete = model.attributes.autocomplete;
        }

        const props: any = {
            mask,
            value: contentValue,
            id: this.props.id,
            maxLength: model.maxSize,
            size: mask ? mask.length : model.size,
            readOnly: model.isEditable === false,
            disabled: model.isEnabled === false,
            required: model.isRequired === true,
            onChange: this.onChange,
            onBlur: this.onBlur,
            flowKey: this.props.flowKey,
            format: model.contentFormat,
            autoComplete: autocomplete,
        };

        if (this.props.isDesignTime) {
            props.onChange = null;
            props.onBlur = null;
            props.isDesignTime = true;
        }

        if (!manywho.utils.isNullOrWhitespace(model.hintValue)) {
            props.placeholder = model.hintValue;
        }

        let className = manywho.styling.getClasses(
            this.props.parentId, this.props.id, 'input', this.props.flowKey,
        ).join(' ');

        if (model.isValid === false || state.isValid === false) {
            className += ' has-error';
        }

        if (model.isVisible === false) {
            className += ' hidden';
        }

        if (outcomes) {
            className += ' has-outcomes';
        }

        className += ' form-group';

        let contentType = model.contentType || 'ContentString';
        if (model.valueElementValueBindingReferenceId) {

            if (model.valueElementValueBindingReferenceId.contentType) {
                contentType = model.valueElementValueBindingReferenceId.contentType;
            } else if (
                Array.isArray(model.valueElementValueBindingReferenceId) &&
                model.valueElementValueBindingReferenceId.length > 0 &&
                model.valueElementValueBindingReferenceId[0].properties
            ) {
                contentType = (manywho.utils.getObjectDataProperty(
                    model.valueElementValueBindingReferenceId[0].properties,
                    'ContentType',
                ) || {}).contentValue;
            }
        }

        const isRequired =
        typeof model.isRequired === 'string' ?
            manywho.utils.isEqual(model.isRequired, 'True', true) :
            model.isRequired;

        let label = (
            <label>
                {model.label}
                {isRequired ? <span className="input-required"> *</span> : null}
            </label>
        );

        let inputElement = null;

        switch (contentType.toUpperCase()) {
        case manywho.component.contentTypes.datetime:
            inputElement = <InputDateTime {...props} />;
            break;

        case manywho.component.contentTypes.boolean:
            label = null;
            inputElement = <InputBoolean {...props} />;
            break;

        case manywho.component.contentTypes.number:
            inputElement = <InputNumber {...props} />;
            break;

        case manywho.component.contentTypes.password:
            delete props.flowKey;
            delete props.format;
            if (manywho.utils.isNullOrWhitespace(props.value)) {
                // Prevent browser from autofilling the wrong password. Chrome in particular guesses the autofill
                // value and generally gets it wrong because there is no username field associated with this
                // value. Also we do not store passwords in plain-text so this value should never be pre-populated.
                props.autoComplete = 'new-password';
            }
            // A type of 'hidden' prevents browsers trying to autofill the previous form input as a username.
            inputElement = <input {...props} className="form-control" type={model.isVisible ? 'password' : 'hidden'} />;
            break;

        default:
            delete props.flowKey;
            delete props.format;

            if (manywho.utils.isNullOrEmpty(mask)) {
                inputElement = (
                    <input
                        {...props}
                        className="form-control"
                        type={model.attributes.type ? model.attributes.type : 'text'}
                    />
                );
            } else {
                inputElement = (
                    <MaskedInput
                        {...props}
                        className="form-control"
                        type={model.attributes.type ? model.attributes.type : 'text'}
                    />
                );
            }
            break;
        }

        const outcomeButtons = outcomes && outcomes.map(outcome => <Outcome key={outcome.id} id={outcome.id} flowKey={this.props.flowKey} />);

        const inputField = (
            <div key="">
                {label}
                {inputElement}
                <span className="help-block">{model.validationMessage || state.validationMessage}</span>
                <span className="help-block">{model.helpInfo}</span>
            </div>
        );

        return (
            <div className={className}>
                {renderOutcomesInOrder(inputField, outcomeButtons, outcomes, model.isVisible)}
            </div>
        );
    }
}

manywho.component.register(registeredComponents.INPUT, Input, ['checkbox']);

export const getInput = () : typeof Input => manywho.component.getByName(registeredComponents.INPUT);

export default Input;
