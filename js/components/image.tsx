import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import { renderOutcomesInOrder } from './utils/CoreUtils';

import '../../css/image.less';

declare const manywho: any;

const Image: React.FC<IComponentProps> = ({ id, parentId, flowKey }) => {

    const classes = manywho.styling.getClasses(parentId, id, 'image', flowKey);
    const model = manywho.model.getComponent(id, flowKey);
    const outcomes = manywho.model.getOutcomes(id, flowKey);
    const { imageUri, developerName, label, width, height, attributes } = model;

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
                className="img-custom"
                src={imageUri}
                alt={developerName}
                id={id}
                width={width}
                height={height}
                {...attributes}
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
