import * as React from 'react';

interface ITileItemProps {
    flowKey: string;
    item: any;
    columns: (any)[];
    outcomes: (any)[];
    deleteOutcome: any;
    onNext: (event: React.SyntheticEvent<HTMLElement>) => void;
    onPrev: (event: React.SyntheticEvent<HTMLElement>) => void;
    onOutcome: (event: React.SyntheticEvent<HTMLElement>) => void;
    onSelect: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export default ITileItemProps;
