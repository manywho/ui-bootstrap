(function (manywho) {

    var returnToParent = React.createClass({

        onClick: function() {

            manywho.engine.returnToParent(this.props.flowKey, this.props.parentStateId);

        },

        render: function () {

            if (!manywho.utils.isNullOrWhitespace(this.props.parentStateId)) {

                manywho.log.info('Rendering Return To Parent');

                return React.DOM.button({ className: 'btn btn-info navbar-btn return-to-parent', onClick: this.onClick}, manywho.settings.global('localization.returnToParent', this.props.flowKey));

            }

            return null;

        }

    });

    manywho.component.register("returnToParent", returnToParent);

}(manywho));
