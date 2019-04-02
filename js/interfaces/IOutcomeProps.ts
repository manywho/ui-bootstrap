import * as React from 'react';
import IComponentProps from './IComponentProps';


interface IOutcomeProps extends IComponentProps {
    size?: string;
    onClick? (event: React.SyntheticEvent<HTMLElement>, model: any, flowKey: string): void;
    className?: string;
    display?: string;
    disabled?: boolean;
}

export default IOutcomeProps;
