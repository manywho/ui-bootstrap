(function (manywho) {

    manywho.component.mixins.enterKeyHandler = {

        onEnter: function (e) {

            if (e.keyCode == 13
                && !e.shiftKey
                && (e.target.className && e.target.className.indexOf('feed') == -1)
                && manywho.settings.global('shortcuts.progressOnEnter', this.props.flowKey, true)) {

                var outcome = manywho.model.getOutcomes(null, this.props.flowKey)
                    .sort(function (a, b) {

                        return a.order - b.order;

                    })
                    .filter(function (outcome) {

                        return manywho.utils.isEqual(outcome.pageActionBindingType, 'save', true);

                    })[0];

                if (outcome) {

                    e.stopPropagation();
                    manywho.engine.move(outcome, this.props.flowKey);

                }

            }

        }

    };

    manywho.component.mixins.collapse =  {

        getInitialState: function () {

            return {
                isVisible: true,
                height: null,
                icon: 'toggle-icon glyphicon glyphicon-triangle-bottom'
            };

        },

        toggleVisibility: function (event) {

            event.preventDefault();

            if (manywho.settings.global('collapsible', this.props.flowKey)) {

                if (this.state.isVisible) {

                    this.setState({
                        isVisible: false,
                        height: ReactDOM.findDOMNode(this).clientHeight,
                        icon: 'toggle-icon glyphicon glyphicon-triangle-right'
                    });

                    var self = this;

                    requestAnimationFrame(function () {
                        self.setState({ height: 0 });
                    });

                } else {

                    this.setState({
                        isVisible: true,
                        height: null,
                        icon: 'toggle-icon glyphicon glyphicon-triangle-bottom'
                    });

                }


            }

        },

        getLabel: function(label, required) {

            if (!manywho.utils.isNullOrWhitespace(label)) {

                var labelClasses = manywho.settings.global('collapsible', this.props.flowKey) ? 'container-label clickable-section' : 'container-label';
                var labelContent = manywho.settings.global('collapsible', this.props.flowKey) && label ? [React.DOM.i({ className: this.state.icon }), label] : [label];

                if (required) {

                    labelContent.push(React.DOM.span({ className: 'input-required' }, ' *'));

                }

                return React.DOM.h3({ className: labelClasses, onClick: this.toggleVisibility }, labelContent);

            }

            return null;

        }

    }

}(manywho));
