import IComponentProps from './IComponentProps';
import IColumn from './IColumn';

interface ITableSmallProps extends IComponentProps {
    onOutcome: Function;
    isValid: boolean;
    objectData: any;
    outcomes: { id: string; }[];
    displayColumns: IColumn[];
}

export default ITableSmallProps;
