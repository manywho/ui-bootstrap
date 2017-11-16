interface IModalContainerProps extends IComponentProps {
    title: string;
    content: any;
    onConfirm: (event: React.SyntheticEvent) => void;
    onCancel: (event: React.SyntheticEvent) => void;
    cancelLabel?: string;
    confirmLabel?: string;
}
