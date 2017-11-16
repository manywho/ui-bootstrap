interface ISelectable {
    isSelectionEnabled: boolean;
    onSelect: (event: React.SyntheticEvent) => void;
    selectAll: (event: React.SyntheticEvent) => void;
}
