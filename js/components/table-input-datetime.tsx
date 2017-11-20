import ITableInputDateTimeProps from '../interfaces/ITableInputDateTimeProps';

import * as moment from 'moment';

import '../../css/input.less';
import '../../css/table.less';
import '../../css/lib/bootstrap-datetimepicker.css';
import '../lib/100-datetimepicker.js';

declare var manywho: any;

class TableInputDateTime extends React.Component<ITableInputDateTimeProps, null> {

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
        const target = ReactDOM.findDOMNode(this.refs['datetime']);
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
        return <div ref="datetime" />;
    }
}

manywho.component.register('table-input-datetime', TableInputDateTime);

export default TableInputDateTime;
