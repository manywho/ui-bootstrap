(function (manywho) {

    var image = React.createClass({

        render: function () {

            var classes = manywho.styling.getClasses(this.props.parentId, this.props.id, 'image', this.props.flowKey);
            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);
            var outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

            var outcomeButtons = outcomes && outcomes.map(function (outcome) {
                return React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey });
            }, this);

            if (model.isVisible == false) {

                classes.push('hidden');

            }

            return React.DOM.div({ className: classes.join(' '), id: this.props.id }, [
                React.DOM.img({ className: 'img-responsive' , src: model.imageUri, alt: model.developerName, id: this.props.id }, null),
                outcomeButtons
            ]);

        }

    });

    manywho.component.register("image", image);

}(manywho));
