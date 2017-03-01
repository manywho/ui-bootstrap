(function (manywho) {

    var voting = React.createClass({

        render: function () {

            var isVisible = manywho.utils.isEqual(manywho.model.getInvokeType(this.props.flowKey), 'waiting_on_votes', true);

            if (isVisible) {

                manywho.log.info('Rendering Voting');

                return React.DOM.div({ className: 'voting' },
                    React.DOM.span({ className: 'glyphicon glyphicon-refresh status-icon spin', 'aria-hidden': 'true' }),
                    React.DOM.p({ className: 'lead' }, 'Waiting on Votes')
                );

            }
            else {

                return null;

            }

        }

    });

    manywho.component.register("voting", voting);

}(manywho));
