/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {
    
    /* tslint:disable-next-line:variable-name */
    const Image: React.SFC<IComponentProps> = ({ id, parentId, flowKey }) => {

        const classes = manywho.styling.getClasses(parentId, id, 'image', flowKey);
        const model = manywho.model.getComponent(id, flowKey);
        const outcomes = manywho.model.getOutcomes(id, flowKey);
        const label = model.label;

        const outcomeButtons = outcomes && outcomes.map((outcome) => {
            return React.createElement(
                manywho.component.getByName('outcome'), 
                { flowKey, id: outcome.id },
            );
        });

        if (model.isVisible !== true) {

            classes.push('hidden');

        }

        return (
            <div className={classes.join(' ')} id={id}>
                {
                    !manywho.utils.isNullOrWhitespace(label) ? 
                        <label className={'img-label'}>{label}</label> : 
                        null
                }
                <img className="img-responsive" src={model.imageUri} 
                    alt={model.developerName} id={id} />
                {outcomeButtons}
            </div>
        );
    };

    manywho.component.register('image', Image);

}(manywho));
