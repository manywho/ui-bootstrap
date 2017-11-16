interface IItemsHeaderProps extends IComponentProps {
    isSearchable: boolean;
    isRefreshable: boolean;
    search: any;
    onSearchChanged: Function;
    onSearch: Function;
    outcomes: any[];
    isDisabled: boolean;
    refresh: (event: React.SyntheticEvent) => void;
}
