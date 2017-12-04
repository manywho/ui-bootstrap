import IComponentProps from './IComponentProps';

interface IItemsHeaderProps extends IComponentProps {
    isSearchable: boolean;
    outcomes: any[];
    refresh: (event: React.SyntheticEvent<HTMLElement>) => void;
    isDisabled?: boolean;
    onSearch?: Function;
    onSearchChanged?: Function;
    search?: any;
}

export default IItemsHeaderProps;
