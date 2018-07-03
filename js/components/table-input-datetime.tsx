import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as $ from 'jquery';
import * as moment from 'moment';
import registeredComponents from '../constants/registeredComponents';
import ITableInputDateTimeProps from '../interfaces/ITableInputDateTimeProps';

import '../../css/input.less';
import '../../css/table.less';
import '../../css/lib/bootstrap-datetimepicker.css';
import '../lib/100-datetimepicker.js';

declare var manywho: any;

class TableInputDateTime extends React.Component<ITableInputDateTimeProps, null> {

    datetime = null;

    constructor(props) {
        super(props);
    }

    onChange = (e) => {
        this.props.onChange(
            this.props.format ? 
            e.date.format(this.props.format) : 
            e.date.format(),
        );
    }

    componentDidMount() {
        const target = findDOMNode(this.datetime);
        const defaultDate = 
            this.props.value ? 
            moment(
                this.props.value, 
                ['MM/DD/YYYY hh:mm:ss A ZZ', moment.ISO_8601, this.props.contentFormat || ''],
            ) : 
            null;

        $(target).datetimepicker({
            defaultDate,
            inline: true,
            sideBySide: true,
            useCurrent: false,
        })
        .on('dp.change', this.onChange);
    }

    render() {
        return <div ref={(datetime) => { this.datetime = datetime; }} />;
    }
}

manywho.component.register(registeredComponents.TABLE_INPUT_DATETIME, TableInputDateTime);

export const getTableInputDateTime = () : typeof TableInputDateTime => manywho.component.getByName(registeredComponents.TABLE_INPUT_DATETIME);

export default TableInputDateTime;
