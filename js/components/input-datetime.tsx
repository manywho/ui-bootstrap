import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import IInputProps from '../interfaces/IInputProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/input.less';
import '../../css/lib/bootstrap-datetimepicker.css';
import '../lib/100-datetimepicker.js';

declare var manywho: any;
declare var moment: any;

interface IInputDateTimeState {
    picker: any; // The datepicker DOM node
}

class InputDateTime extends React.Component<IInputProps, IInputDateTimeState> {

    isDateOnly: boolean;

    constructor(props: IInputProps) {
        super(props);

        this.state = { picker: null };
        this.isDateOnly = true;
    }

    isEmptyDate(date) {
        if (date == null
            || date.indexOf('01/01/0001') !== -1
            || date.indexOf('1/1/0001') !== -1
            || date.indexOf('0001-01-01') !== -1)
            return true;

        return false;
    }

    format(date) {
        return date.utc().format(this.isDateOnly ? 'YYYY-MM-DD' : undefined);
    }

    onChange = (e) => {
        if (!this.props.isDesignTime) {
            if (!e.date)
                this.props.onChange(null);
            else if (e.date.isValid())
                this.props.onChange(this.format(e.date));
            else
                this.props.onChange(e.target.value);
        }
    }

    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            $(ReactDOM.findDOMNode(this.refs['datepicker'])).data('DateTimePicker').clear();
            this.props.onChange(null);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        // A force update inside the parent component causes the component
        // to update everytime a change event is fired. We do not necessarily
        // want to re-render the component each time this happens, only when
        // current and previous value prop is set to a date.
        if (this.props.value === null && nextProps.value === null) {
            return false;
        } 

        return true;
    }

    componentDidUpdate() {
        if (!this.props.isDesignTime) {
            if (this.isEmptyDate(this.props.value)) {
                manywho.state.setComponent(
                    this.props.id, { contentValue: null }, this.props.flowKey, true,
                );

                // When the component is updated and no date is defined
                // the datepicker value should be set to null
                $(this.state.picker).data('DateTimePicker').date(null);
            } else {
                const date = moment(
                    this.props.value, 
                    [
                        'MM/DD/YYYY hh:mm:ss A ZZ', 'YYYY-MM-DDTHH:mm:ss.SSSSSSSZ', 
                        moment.ISO_8601,
                    ],
                );

                manywho.state.setComponent(
                    this.props.id, 
                    { contentValue: this.format(date) }, 
                    this.props.flowKey, 
                    true,
                );
                if (
                    manywho.settings.global('i18n.overrideTimezoneOffset', this.props.flowKey) && 
                    !this.isDateOnly
                ) {
                    $(this.state.picker).data('DateTimePicker').date(date.local());
                } else {
                    $(this.state.picker).data('DateTimePicker').date(date.utc());
                }

            }
        }
    }

    componentDidMount() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        
        let useCurrent = false;
        let customFormat = null;

        if (model.attributes) {
            if (model.attributes.useCurrent !== undefined)
                useCurrent = manywho.utils.isEqual(model.attributes.useCurrent, 'true', true) ? 
                    true : 
                    false;

            if (model.attributes.dateTimeFormat)
                customFormat = model.attributes.dateTimeFormat;
        }

        if (customFormat)
            this.isDateOnly = 
                customFormat.toLowerCase().indexOf('h') === -1 && 
                customFormat.toLowerCase().indexOf('m') === -1 && 
                customFormat.toLowerCase().indexOf('s') === -1;

        const datepickerElement = ReactDOM.findDOMNode(this.refs['datepicker']);

        $(datepickerElement).datetimepicker({
            useCurrent,
            locale: model.attributes.dateTimeLocale || 'en-us',
            focusOnShow: false,
            format: customFormat || 
                manywho.formatting.toMomentFormat(model.contentFormat) || 
                'MM/DD/YYYY',
            keyBinds: {
                delete() { this.clear(); },
            },
            timeZone: 'UTC',
        })
        .on('dp.change', !this.props.isDesignTime && this.onChange);

        // 
        this.setState({ picker: datepickerElement });
    }

    componentWillUnmount() {
        if (this.refs['datepicker'])
            $(ReactDOM.findDOMNode(this.refs['datepicker'])).data('DateTimePicker').destroy();
    }

    render() {
        return <input id={this.props.id}
            placeholder={this.props.placeholder}
            className="form-control datepicker"
            ref="datepicker"
            type="datetime"
            size={this.props.size}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            required={this.props.required}
            onBlur={this.props.onBlur}
            autoComplete={this.props.autocomplete}
            onKeyDown={this.onKeyDown} />;
    }

}

manywho.component.register(registeredComponents.INPUT_DATETIME, InputDateTime);

export const getInputDateTime = () : typeof InputDateTime => manywho.component.getByName(registeredComponents.INPUT_DATETIME) || InputDateTime;

export default InputDateTime;
