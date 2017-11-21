import IComponentProps from './IComponentProps';

interface IModalContainerProps extends IComponentProps {
    title: string;
    content: any;
    onConfirm: (event: React.SyntheticEvent<HTMLElement>) => void;
    onCancel: (event: React.SyntheticEvent<HTMLElement>) => void;
    cancelLabel?: string;
    confirmLabel?: string;
}

export default IModalContainerProps;
