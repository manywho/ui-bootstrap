interface IOutcomeProps extends IComponentProps {
    size: string;
    onClick(event: React.SyntheticEvent, model: any, flowKey: string): void;
    className: string;
    display: string;
    disabled: boolean;
}
