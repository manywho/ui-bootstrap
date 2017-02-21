(function (manywho) {

    var hidden = React.createClass({

        render: function () {

            manywho.log.info('Rendering Hidden: ' + this.props.id);
            return null;

        }

    });

    manywho.component.register("hidden", hidden);

}(manywho));
