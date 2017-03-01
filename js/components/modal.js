(function (manywho) {

    var modal = React.createClass({

        mixins: [manywho.component.mixins.enterKeyHandler],

        renderModal: function() {

            var children = manywho.model.getChildren('root', this.props.flowKey);
            var outcomes = manywho.model.getOutcomes('root', this.props.flowKey);
            var state = manywho.state.getComponent(manywho.utils.extractElement(this.props.flowKey), this.props.flowKey) || {};

            if (state && state.loading == null && !manywho.utils.isEqual(manywho.model.getInvokeType(this.props.flowKey), 'sync', true)) {

                manywho.component.focusInput(this.props.flowKey);

            }

            return React.DOM.div({ className: 'modal show' }, [
                React.DOM.div({ className: 'modal-dialog', onKeyUp: this.onEnter }, [
                    React.DOM.div({ className: 'modal-content' }, [
                        React.DOM.div({ className: 'modal-header' }, [
                            React.DOM.h4({ className: 'modal-title' }, manywho.model.getLabel(this.props.flowKey))
                        ]),
                        React.DOM.div({ className: 'modal-body' }, [
                            manywho.component.getChildComponents(children, this.props.id, this.props.flowKey)
                        ]),
                        React.DOM.div({ className: 'modal-footer' }, [
                            manywho.component.getOutcomes(outcomes, this.props.flowKey)
                        ]),
                        React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'left' }),
                        React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'center' }),
                        React.createElement(manywho.component.getByName('notifications'), { flowKey: this.props.flowKey, position: 'right' }),
                        React.createElement(manywho.component.getByName('wait'), { isVisible: state.loading, message: state.loading && state.loading.message }, null)
                    ])
                ])
            ]);

        },

        renderBackdrop: function(modal) {

            return React.DOM.div(null, [
                React.DOM.div({ className: 'modal-backdrop full-height' }, null),
                modal
            ]);

        },

        render: function () {

            manywho.log.info("Rendering Modal");

            if (this.props.container) {

                this.props.container.classList.remove('hidden');

            }

            return this.renderBackdrop(this.renderModal());

        }

    });

    manywho.component.register("modal", modal, ["modal-standalone"]);

}(manywho));
