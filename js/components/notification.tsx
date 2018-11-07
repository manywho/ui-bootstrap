import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import INotificationProps from '../interfaces/INotificationProps';

import '../../css/notifications.less';
    
class Notification extends React.Component<INotificationProps, null> {

    timeout = null;

    dismiss() {
        manywho.model.removeNotification(this.props.flowKey, this.props.model);
    }

    componentDidMount() {

        if (this.props.model.timeout && this.props.model.timeout > 0) {

            this.timeout = setTimeout(
                () => {
                    clearTimeout(this.timeout);
                    this.dismiss();

                }, 
                this.props.model.timeout,
            );
        }
    }

    render () {

        manywho.log.info('Rendering Notification');

        const classNames = [
            'alert notification',
            'alert-' + this.props.model.type,
            (this.props.model.dismissible) ? 'alert-dismissible' : null,
        ].join(' ');

        return (
            <div className={classNames}>
                {
                    this.props.model.dismissible ? 
                    <button className={'close'} onClick={this.dismiss.bind(this)}>
                        <span>{'\u00D7'}</span>
                    </button> : 
                    null
                }
                <span className="format-pre-line">{ this.props.model.message }</span>
            </div>
        );

    }
}

manywho.component.register(registeredComponents.NOTIFICATION, Notification);

export const getNotification = () : typeof Notification => manywho.component.getByName(registeredComponents.NOTIFICATION);

export default Notification;
