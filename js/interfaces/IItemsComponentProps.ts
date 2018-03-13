import IComponentProps from './IComponentProps';

interface IItemsComponentProps extends IComponentProps {
    id: string;
    parentId: string;
    flowKey: string;
    isDesignTime: boolean;
    contentElement: JSX.Element;
    hasMoreResults: boolean;
    onOutcome: Function;
    select: Function;
    selectAll: Function;
    clearSelection: Function;
    objectData: any[];
    onSearch: Function;
    outcomes: any[];
    refresh: any;
    onNext: Function;
    onPrev: Function;
    onFirstPage: Function;
    page: number;
    limit: number;
    isLoading: boolean;
    sort: Function;
    sortedBy: boolean;
    sortedIsAscending: string;
}

export default IItemsComponentProps;
