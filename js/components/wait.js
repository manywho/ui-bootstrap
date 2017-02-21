(function (manywho) {

    function arePropsSpecified(props) {

        if (Object.keys(props).length == 1) {

            return !props.hasOwnProperty('children');

        }

        return Object.keys(props).length > 0;

    }

    var wait = React.createClass({

        componentDidUpdate: function() {

            if (this.refs.wait) {

                var element = this.refs.wait;
                if (element.clientHeight > window.innerHeight) {

                    element.children[0].style.top = 'calc(40% + ' + window.scrollY + ')';

                }

            }

        },

        getDefaultProps: function() {

            return {
                isVisible: false,
                isSmall: false,
                message: null
            }

        },

        render: function () {

            if (this.props.isVisible) {

                manywho.log.info('Rendering Wait');

                var spinnerClassNames = ['wait-spinner'];
                if (this.props.isSmall) {

                    spinnerClassNames.push('wait-spinner-small');

                }

                return React.DOM.div({ className:'wait-container', ref: 'wait' }, [
                    React.DOM.div({ className: spinnerClassNames.join(' ') }, null),
                    React.DOM.span({ className: 'wait-message' }, this.props.message)
                ]);

            }

            return null;

        }

    });

    manywho.component.register("wait", wait);

}(manywho));
