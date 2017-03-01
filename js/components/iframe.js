(function (manywho) {

    var iframe = React.createClass({

        render: function () {

            manywho.log.info('Rendering iframe: ' + this.props.id);

            var classes = manywho.styling.getClasses(this.props.parentId, this.props.id, 'iframe', this.props.flowKey);
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);
            var outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

            var outcomeButtons = outcomes && outcomes.map(function (outcome) {
                return React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey });
            }, this);

            return React.DOM.div({ className: classes.join(' '), id: this.props.id }, [
                React.DOM.iframe({ src: model.imageUri, width: model.width, height: model.height, id: this.props.id, frameBorder: 0 }, null),
                outcomeButtons
            ]);

        }

    });

    manywho.component.register("iframe", iframe);

}(manywho));
