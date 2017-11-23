import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IReturnToParentProps from '../interfaces/IReturnToParentProps';

import '../../css/returnToParent.less';

const ReturnToParent: React.SFC<IReturnToParentProps> = ({ flowKey, parentStateId }) => {

    const onClick = () => {

        manywho.engine.returnToParent(flowKey, parentStateId);
    };

    if (!manywho.utils.isNullOrWhitespace(parentStateId)) {

        manywho.log.info('Rendering Return To Parent');

        return (
            <button className={'btn btn-info navbar-btn return-to-parent'} onClick={onClick}>
            { 
                manywho.settings.global('localization.returnToParent', flowKey) 
            }
            </button>
        );
    }

    return null;
};

manywho.component.register(registeredComponents.RETURN_TO_PARENT, ReturnToParent);

export const getReturnToParent = () : typeof ReturnToParent => manywho.component.getByName(registeredComponents.RETURN_TO_PARENT);

export default ReturnToParent;
