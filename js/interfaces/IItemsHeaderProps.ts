import IComponentProps from './IComponentProps';

interface IItemsHeaderProps extends IComponentProps {
    isSearchable: boolean;
    isRefreshable: any;
    outcomes: any[];
    refresh: any;
    isDisabled?: boolean;
    onSearch?: Function;
    onSearchChanged?: Function;
    search?: any;
}

export default IItemsHeaderProps;
