interface INotificationProps extends IComponentProps {
    model: {
        type: string;
        message: string;
        timeout: number;
        dismissible: boolean;
    };
}
