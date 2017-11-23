import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import '../../css/iframe.less';

const IFrame: React.SFC<IComponentProps> = ({ id, flowKey, parentId }) => {

    manywho.log.info('Rendering iframe: ' + id);

    const Outcome = getOutcome();

    const classes = manywho.styling.getClasses(parentId, id, 'iframe', flowKey);
    const model = manywho.model.getComponent(id, flowKey);
    const outcomes = manywho.model.getOutcomes(id, flowKey);

    const outcomeButtons = outcomes && outcomes.map((outcome) => {
        return <Outcome flowKey={flowKey} id={outcome.id} />;
    });

    return <div className={classes.join(' ')} id={id}>
        <iframe src={model.imageUri} width={model.width}
            height={model.height} id={id} frameBorder={0} />
        {outcomeButtons}
    </div>;
};

manywho.component.register(registeredComponents.IFRAME, IFrame);

export const getIFrame = () : typeof IFrame => manywho.component.getByName(registeredComponents.IFRAME);

export default IFrame;
