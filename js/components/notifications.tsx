import INotificationsProps from '../interfaces/INotificationsProps';

import '../../css/notifications.less';

/* tslint:disable-next-line:variable-name */
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

manywho.component.register('notifications', Notifications);

export default Notifications;
