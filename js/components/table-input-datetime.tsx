/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    class TableInputDateTime extends React.Component<any, any> {

        onChange = (e) => {
            this.props.onChange(this.props.format ? e.date.format(this.props.format) : e.date.format());
        }

        componentDidMount() {
            const target = ReactDOM.findDOMNode(this.refs['datetime']);
            const defaultDate = this.props.value ? moment(this.props.value, ['MM/DD/YYYY hh:mm:ss A ZZ', moment.ISO_8601, this.props.contentFormat || '']) : null;

            $(target).datetimepicker({
                inline: true,
                sideBySide: true,
                useCurrent: false,
                defaultDate: defaultDate
            })
            .on('dp.change', this.onChange);
        }

        render() {
            return <div ref="datetime" />;
        }
    }

    manywho.component.register('table-input-datetime', TableInputDateTime);

}(manywho));
