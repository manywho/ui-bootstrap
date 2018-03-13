import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

import '../../css/status.less';

declare var manywho: any;

class Status extends React.Component<IComponentProps, null> {

    render () {

        const isVisible: boolean = 
            manywho.utils.isEqual(
                manywho.model.getInvokeType(this.props.flowKey), 'wait', true)
            || manywho.utils.isEqual(
                manywho.model.getInvokeType(this.props.flowKey), 'status', true);

        if (isVisible) {
            manywho.log.info('Rendering Status');

            const message: string = 
                manywho.settings.global('localization.status', this.props.flowKey, null)
                || manywho.model.getWaitMessage(this.props.flowKey) 
                || '';

            let content = <p className="lead status-message status-content">{message}</p>;

            if (message.indexOf('<') !== -1 && message.indexOf('>') !== -1)
                content = 
                    <div className="status-content" 
                        dangerouslySetInnerHTML={{ __html: message }}/>;

            return (
                <div className="status">
                    <div className="wait-spinner"></div>
                    {content}
                </div>
            );

        }

        return null;
    }
}

manywho.component.register(registeredComponents.STATUS, Status);

export const getStatus = () : typeof Status => manywho.component.getByName(registeredComponents.STATUS) || Status;

export default Status;
