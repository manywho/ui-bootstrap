/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    class TableInputDateTime extends React.Component<any, any> {

        onChange = (e) => {
            this.props.onChange(e.date.format());
        }

        componentDidMount() {
            const target = ReactDOM.findDOMNode(this.refs['datetime']);
            
            $(target).datetimepicker({
                inline: true,
                sideBySide: true
            })
            .on('dp.change', this.onChange);
        }

        render() {
            return <div ref="datetime" />
        }
    }

    manywho.component.register("table-input-datetime", TableInputDateTime);

}(manywho));