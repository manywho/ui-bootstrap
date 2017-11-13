/// <reference path="../../typings/index.d.ts" />

(function (manywho) {
    
    /* tslint:disable-next-line:variable-name */
    const IFrame: React.SFC<IComponentProps> = ({ id, flowKey, parentId }) => {

        manywho.log.info('Rendering iframe: ' + id);

        const classes = manywho.styling.getClasses(parentId, id, 'iframe', flowKey);
        const model = manywho.model.getComponent(id, flowKey);
        const outcomes = manywho.model.getOutcomes(id, flowKey);

        const outcomeButtons = outcomes && outcomes.map((outcome) => {
            return React.createElement(
                manywho.component.getByName('outcome'), 
                { flowKey, id: outcome.id },
            );
        });

        return <div className={classes.join(' ')} id={id}>
            <iframe src={model.imageUri} width={model.width} 
                height={model.height} id={id} frameBorder={0} />
            {outcomeButtons}
        </div>;
    };

    manywho.component.register('iframe', IFrame);

}(manywho));
