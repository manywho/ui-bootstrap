/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    const image = React.createClass({

        render: function () {

            const classes = manywho.styling.getClasses(this.props.parentId, this.props.id, 'image', this.props.flowKey);
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
            const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
            const label = model.label;

            const outcomeButtons = outcomes && outcomes.map(function (outcome) {
                return React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey });
            }, this);

            if (model.isVisible !== true) {

                classes.push('hidden');

            }

            return (
                <div className={classes.join(' ')} id={this.props.id}>
                    {
                        !manywho.utils.isNullOrWhitespace(label) ? <label className={'img-label'}>{label}</label> : null
                    }
                    <img className="img-responsive" src={model.imageUri} alt={model.developerName} id={this.props.id} />
                    {outcomeButtons}
                </div>
            );

        }

    });

    manywho.component.register('image', image);

}(manywho));
