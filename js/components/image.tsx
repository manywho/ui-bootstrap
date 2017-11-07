/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

// Cannot use 'Image' for component name as it clashes with the browser native window.Image class
const MWImage: React.SFC<IComponentProps> = ({ id, parentId, flowKey }) => {

    const classes = manywho.styling.getClasses(parentId, id, 'image', flowKey);
    const model = manywho.model.getComponent(id, flowKey);
    const outcomes = manywho.model.getOutcomes(id, flowKey);
    const label = model.label;

    const outcomeButtons = outcomes && outcomes.map(function (outcome) {
        return React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: flowKey });
    }, this);

    if (model.isVisible !== true) {

        classes.push('hidden');

    }

    return (
        <div className={classes.join(' ')} id={id}>
            {
                !manywho.utils.isNullOrWhitespace(label) ? <label className={'img-label'}>{label}</label> : null
            }
            <img className="img-responsive" src={model.imageUri} alt={model.developerName} id={id} />
            {outcomeButtons}
        </div>
    );
};

manywho.component.register('image', MWImage);
