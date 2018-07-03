import * as React from 'react';
import * as moment from 'moment';
import registeredComponents from '../constants/registeredComponents';
import ITableInputProps from '../interfaces/ITableInputProps';
import { getTableInputDateTime } from './table-input-datetime';

import '../../css/input.less';

interface ITableInputState {
    value?: any;
    currentValue?: any;
    isFocused?: boolean;
}

declare var manywho: any;

class TableInput extends React.Component<ITableInputProps, ITableInputState> {

    getInputType(contentType) {

        switch (contentType.toUpperCase()) {
        case manywho.component.contentTypes.string:
            return 'text';
        case manywho.component.contentTypes.number:
            return 'number';
        case manywho.component.contentTypes.boolean:
            return 'checkbox';
        case manywho.component.contentTypes.password:
            return 'password';
        case manywho.component.contentTypes.datetime:
            return 'datetime';
        default:
            return 'text';
        }
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
        if (
            manywho.utils.isEqual(
                this.props.contentType, 
                manywho.component.contentTypes.boolean, 
                true,
            )
        ) {
            const checked = 
                typeof this.state.value === 'string' && 
                manywho.utils.isEqual(this.state.value, 'false', true) ? 
                false : 
                (this.state.value as Boolean).valueOf();
                
            this.setState({ value: !checked });

        } else if (
            manywho.utils.isEqual(
                this.props.contentType, 
                manywho.component.contentTypes.datetime, 
                true,
            )
        ) {
            this.setState({ value: e });
        } else {
            this.setState({ value: e.currentTarget.value });
        }
    }

    onKeyUp = (e) => {
        if (e.keyCode === 13 && !this.props.isDesignTime && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            this.onCommit();
        }
    }

    onFocus = (e) => {
        this.setState({ isFocused: true });
    }

    onBlur = () => {
        this.setState({ isFocused: false });

        if (!this.props.isDesignTime)
            this.onCommit();
    }

    onClick = (e) => {
        e.stopPropagation();

        const TableInputDateTime = getTableInputDateTime();

        if (
            manywho.utils.isEqual(
                this.props.contentType, 
                manywho.component.contentTypes.datetime, 
                true,
            )
        ) {
            this.setState({ currentValue: this.state.value });
            manywho.model.setModal(
                this.props.flowKey, 
                {
                    content: <TableInputDateTime 
                        value={this.state.value} 
                        onChange={this.onChange} 
                        format={manywho.formatting.toMomentFormat(this.props.contentFormat)} 
                    />,
                    onConfirm: this.onCommit,
                    onCancel: this.onCloseDateTimePicker,
                    flowKey: this.props.flowKey,
                },
            );
        }
    }

    onCommit = () => {
        if (
            manywho.utils.isEqual(
                this.props.contentType, 
                manywho.component.contentTypes.datetime, 
                true,
            ) && 
            !this.isEmptyDate(this.state.value)
        ) {
            const dateTime = moment(
                this.state.value, 
                ['MM/DD/YYYY hh:mm:ss A ZZ', moment.ISO_8601, this.props.contentFormat || ''],
            );

            this.props.onCommitted(this.props.id, this.props.propertyId, dateTime.format());
            manywho.model.setModal(this.props.flowKey, null);
        } else {
            this.props.onCommitted(this.props.id, this.props.propertyId, this.state.value);
        }
    }

    onCloseDateTimePicker = (e) => {
        this.setState({ value: this.state.currentValue, currentValue: null });
        manywho.model.setModal(this.props.flowKey, null);
    }

    componentWillMount() {
        this.setState({ value: this.props.value });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    render() {
        manywho.log.info('Rendering Table Input: ' + this.props.id);

        let className = 'input-sm';

        if (!this.state.isFocused)
            className += ' table-input-display';

        if (
            !manywho.utils.isEqual(
                this.props.contentType, manywho.component.contentTypes.boolean, true,
            )
        ) {
            className += ' form-control';
        }

        const props: any = {
            className,
            onClick: this.onClick,
            onChange: this.onChange,
            onKeyUp: this.onKeyUp,
            value: this.state.value,
            onFocus: this.onFocus,
        };

        if (
            !manywho.utils.isEqual(
                this.props.contentType, manywho.component.contentTypes.datetime, true,
            )
        ) {
            props.onBlur = this.onBlur;
        }

        if (
            manywho.utils.isEqual(
                this.props.contentType, 
                manywho.component.contentTypes.boolean, 
                true,
            )
        ) {
            props.checked = 
                this.state.value === true || manywho.utils.isEqual(
                    this.state.value, 'true', true,
                );
        }

        if (
            manywho.utils.isEqual(
                this.props.contentType, manywho.component.contentTypes.string, true,
            )
        ) {
            props.rows = 1;
            return <textarea {...props} />;
        }

        props.type = this.getInputType(this.props.contentType);
        return <input id="myId" {...props}/>;
    }
}

manywho.component.register(registeredComponents.TABLE_INPUT, TableInput);

export const getTableInput = () : typeof TableInput => manywho.component.getByName(registeredComponents.TABLE_INPUT);

export default TableInput;


