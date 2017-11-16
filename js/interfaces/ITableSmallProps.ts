interface ITableSmallProps extends IComponentProps {
    onOutcome: Function;
    isValid: boolean;
    objectData: any;
    outcomes: { id: string; }[];
    displayColumns: IColumn[];
}
