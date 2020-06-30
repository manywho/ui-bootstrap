import * as React from 'react';
import IInputProps from '../interfaces/IInputProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/input.less';

declare var manywho: any;

interface IInputNumberState {
    value: string;
}

class InputNumber extends React.Component<IInputProps, IInputNumberState> {

    constructor(props: IInputProps) {
        super(props);

        this.state = { value: null };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ value: e.target.value });

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const value = e.target.value.replace(/^\s+|\s+$/g, '');
        let parsedValue = parseFloat(value);

        if (manywho.utils.isNullOrWhitespace(value))
            this.props.onChange('');
        else if (!isNaN(value)) {
            let max = (Math.pow(10, model.maxSize)) - 1;
            let min = (Math.pow(10, model.maxSize) * - 1) + 1;

            if (model.attributes) {
                if (!manywho.utils.isNullOrUndefined(model.attributes.minimum))
                    min = parseFloat(model.attributes.minimum);

                if (!manywho.utils.isNullOrUndefined(model.attributes.maximum))
                    max = parseFloat(model.attributes.maximum);
            }

            parsedValue = Math.min(parsedValue, max);
            parsedValue = Math.max(parsedValue, min);

            manywho.state.setComponent(this.props.id, { isValid: true }, this.props.flowKey, true);

            if (parseFloat(value) !== parsedValue)
                this.setState({ value: parsedValue.toString() });

            setTimeout(() => this.props.onChange(parsedValue));
        } else if (isNaN(value) && !manywho.utils.isNullOrWhitespace(value))
            manywho.state.setComponent(this.props.id, { isValid: false }, this.props.flowKey, true);
    }

    componentWillMount() {
        this.setState({ 
            value: !manywho.utils.isNullOrUndefined(this.props.value) ? 
                manywho.formatting.number(this.props.value, this.props.format) : 
                null,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            !manywho.utils.isNullOrUndefined(nextProps.value) && 
            parseFloat(this.state.value) !== nextProps.value
        ) {
            this.setState({ value: nextProps.value.toString() });
        } else if (manywho.utils.isNullOrUndefined(nextProps.value)) {
            this.setState({ value: null });
        }
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        const style = { width: 30 + (15 * model.size) + 'px' };
        let max = (Math.pow(10, Math.min(model.maxSize, 17))) - 1;
        let min = (Math.pow(10, Math.min(model.maxSize, 17)) * -1) + 1;
        let step = 1;

        if (model.attributes) {
            if (!manywho.utils.isNullOrUndefined(model.attributes.minimum))
                min = model.attributes.minimum;

            if (!manywho.utils.isNullOrUndefined(model.attributes.maximum))
                max = model.attributes.maximum;

            if (!manywho.utils.isNullOrUndefined(model.attributes.step))
                step = model.attributes.step;
        }

        return <input id={this.props.id}
            value={this.state.value}
            placeholder={this.props.placeholder}
            className="form-control"
            type="number"
            style={style}
            max={max}
            min={min}
            step={step}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            required={this.props.required}
            onChange={!this.props.isDesignTime && this.onChange}
            onBlur={this.props.onBlur}
            autoComplete={this.props.autocomplete} />;
    }

}

manywho.component.register(registeredComponents.INPUT_NUMBER, InputNumber);

export const getInputNumber = () : typeof InputNumber => manywho.component.getByName(registeredComponents.INPUT_NUMBER) || InputNumber;

export default InputNumber;
