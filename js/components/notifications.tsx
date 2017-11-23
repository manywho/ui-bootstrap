import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import INotificationsProps from '../interfaces/INotificationsProps';

import '../../css/notifications.less';

const Notifications: React.SFC<INotificationsProps> = ({ flowKey, position }) => {

    const models = manywho.model.getNotifications(flowKey, position);
    const notificationComponent = manywho.component.getByName('notification');
    const padding = (models.length > 0) ? '20px' : null;

    return (
        <ul className={ position + '-notifications notifications'} 
            style={ { padding } }>
        {
            models.map((item) => {
                return (
                    <li>
                    {
                        React.createElement(
                            notificationComponent, { flowKey, model: item },
                        )
                    }
                    </li>
                );
            })
        }
        </ul>
    );
};

manywho.component.register(registeredComponents.NOTIFICATIONS, Notifications);

export const getNotifications = () : typeof Notifications => manywho.component.getByName(registeredComponents.NOTIFICATIONS);

export default Notifications;
