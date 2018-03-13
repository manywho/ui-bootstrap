import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

const Voting: React.SFC<IComponentProps> = ({ flowKey }) => {

    const isVisible = manywho.utils.isEqual(
        manywho.model.getInvokeType(flowKey),
        'waiting_on_votes',
        true,
    );

    if (isVisible) {
        manywho.log.info('Rendering Voting');
        return(
            <div className="voting">
                <span className= "glyphicon glyphicon-refresh status-icon spin"
                aria-hidden= "true"></span>
                <p className="lead">Waiting on votes</p>
            </div>
        );

    }
    return <noscript />;
};

manywho.component.register(registeredComponents.VOTING, Voting);

export const getVoting = () : typeof Voting => manywho.component.getByName(registeredComponents.VOTING) || Voting;

export default Voting;
