/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IInputProps.ts" />

declare var manywho: any;
declare var moment: any;

interface IInputDateTimeState {
    value: string
}

class InputDateTime extends React.Component<IInputProps, IInputDateTimeState> {

    isDateOnly: boolean;

    constructor(props: IInputProps) {
        super(props);

        this.state = { value: null };
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

    onChange = (e) => {
        if (!this.props.isDesignTime) {
            if (!e.date)
                this.props.onChange(null);
            else if (e.date.isValid()) {
                if (this.isDateOnly)
                    e.date.hour(12);

                if (manywho.settings.global('i18n.overrideTimezoneOffset', this.props.flowKey))
                    this.props.onChange(e.date.format());
                else
                    this.props.onChange(e.date.utc().format());
            }
            else
                this.props.onChange(e.target.value);
        }
    }

    onKeyDown = (e) => {
        if (e.keyCode === 8) {
            $(ReactDOM.findDOMNode(this.refs['datepicker'])).data("DateTimePicker").clear();
            this.props.onChange(null);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    componentDidMount() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        let useCurrent = true;
        let customFormat = null;

        if (model.attributes) {
            if (model.attributes.useCurrent !== undefined)
                useCurrent = manywho.utils.isEqual(model.attributes.useCurrent, 'true', true) ? true : false;

            if (model.attributes.dateTimeFormat)
                customFormat = model.attributes.dateTimeFormat;
        }

        if (customFormat)
            this.isDateOnly = customFormat.toLowerCase().indexOf('h') === -1 && customFormat.toLowerCase().indexOf('m') === -1 && customFormat.toLowerCase().indexOf('s') === -1;

        let stateDate = null;
        const datepickerElement = ReactDOM.findDOMNode(this.refs['datepicker']);

        $(datepickerElement).datetimepicker({
            locale: model.attributes.dateTimeLocale || 'en-us',
            format: customFormat || manywho.formatting.toMomentFormat(model.contentFormat) || 'MM/DD/YYYY',
            keyBinds: {
                'delete': function () {
                    this.clear();
                }
            },
            useCurrent: useCurrent
        })
        .on('dp.change', !this.props.isDesignTime && this.onChange);

        if (!this.props.isDesignTime) {
            if (this.isEmptyDate(state.contentValue))
                manywho.state.setComponent(this.props.id, { contentValue: null }, this.props.flowKey, true);
            else {
                stateDate = moment(state.contentValue, ['MM/DD/YYYY hh:mm:ss A ZZ', 'YYYY-MM-DDTHH:mm:ss.SSSSSSSZ', moment.ISO_8601]);
                manywho.state.setComponent(this.props.id, { contentValue: stateDate.format(customFormat || 'MM/DD/YYYY') }, this.props.flowKey, true);
                $(datepickerElement).data('DateTimePicker').date(stateDate);
            }
        }
    }

    componentWillUnmount() {
        if (this.refs['datepicker'])
            $(ReactDOM.findDOMNode(this.refs['datepicker'])).data('DateTimePicker').destroy();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === null) {
            this.setState({ value: null });
            return;
        }

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const formats = [moment.ISO_8601, 'MM/DD/YYYY hh:mm:ss A ZZ'];
        let customFormat = null;

        if (model.attributes && model.attributes.dateTimeFormat) {
            customFormat = model.attributes.dateTimeFormat;
            formats.push(customFormat);
        }

        const dateTime = moment(nextProps.value, formats);

        if (dateTime.isValid())
            this.setState({ value: dateTime.format(customFormat || 'MM/DD/YYYY') });
    }

    render() {
        return <input id={this.props.id}
            value={this.state.value}
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

manywho.component.register('input-datetime', InputDateTime);
