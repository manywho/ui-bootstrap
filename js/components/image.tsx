import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';

declare var manywho: any;

const Image: React.SFC<IComponentProps> = ({ id, parentId, flowKey }) => {

    const classes = manywho.styling.getClasses(parentId, id, 'image', flowKey);
    const model = manywho.model.getComponent(id, flowKey);
    const outcomes = manywho.model.getOutcomes(id, flowKey);
    const label = model.label;

    const Outcome = getOutcome();

    const outcomeButtons = outcomes && outcomes.map(outcome => <Outcome flowKey={flowKey} id={outcome.id} />);

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

manywho.component.register(registeredComponents.IMAGE, Image);

export const getImage = () : typeof Image => manywho.component.getByName(registeredComponents.IMAGE);

export default Image;
