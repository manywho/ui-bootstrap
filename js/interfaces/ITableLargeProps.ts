/// <reference path="./ISortable.ts" />
/// <reference path="./ISelectable.ts" />
/// <reference path="./IColumn.ts" />

interface ITableLargeProps extends IComponentProps, ISortable, ISelectable {
    model: any;
    objectData: any;    
    selectedRows: { externalId: string }[];
    totalObjectData: any;
    onHeaderClick: (event: React.SyntheticEvent) => void;
    onRowClicked: (event: React.SyntheticEvent) => void;
    outcomes: { id: string; }[];
    onOutcome: Function;
    isFiles: boolean;
    displayColumns: IColumn[]; 
}
