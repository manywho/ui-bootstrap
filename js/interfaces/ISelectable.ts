import * as React from 'react';

interface ISelectable {
    isSelectionEnabled: boolean;
    onSelect: (event: React.SyntheticEvent<HTMLElement>) => void;
    selectAll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export default ISelectable;
