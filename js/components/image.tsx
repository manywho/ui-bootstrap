import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import { renderOutcomesInOrder } from './utils/CoreUtils';

declare const manywho: any;

const Image: React.SFC<IComponentProps> = ({ id, parentId, flowKey }) => {

    const classes = manywho.styling.getClasses(parentId, id, 'image', flowKey);
    const model = manywho.model.getComponent(id, flowKey);
    const outcomes = manywho.model.getOutcomes(id, flowKey);
    const { label } = model;

    const Outcome = getOutcome();

    const outcomeButtons = outcomes && outcomes.map(outcome => <Outcome flowKey={flowKey} id={outcome.id} key={outcome.id} />);

    if (model.isVisible !== true) {

        classes.push('hidden');
    }

    const image = (
        <div>
            {
                !manywho.utils.isNullOrWhitespace(label) ?
                    <label className="img-label">{label}</label> :
                    null
            }
            <img
                className="img-responsive"
                src={model.imageUri}
                alt={model.developerName}
                id={id}
            />
        </div>
    );

    return (
        <div className={classes.join(' ')} id={id}>
            {renderOutcomesInOrder(image, outcomeButtons, outcomes, model.isVisible)}
        </div>
    );
};

manywho.component.register(registeredComponents.IMAGE, Image);

export const getImage = () : typeof Image => manywho.component.getByName(registeredComponents.IMAGE);

export default Image;
