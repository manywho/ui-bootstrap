interface IItemsHeaderProps extends IComponentProps {
    isSearchable: boolean;
    isRefreshable: boolean;
    search: any;
    onSearchChanged: Function;
    onSearch: Function;
    outcomes: any[];
    isDisabled: boolean;
    refresh: (MouseEvent) => void;
}
