import * as React from 'react';
import IComponentProps from './IComponentProps';

interface IChartComponentProps extends IComponentProps {
    type: string;
    options: any;
    outcomes: any[];
    contentElement: JSX.Element;
    objectData: any[];
    isLoading: boolean;
    onOutcome: Function;
    refresh: (event: React.SyntheticEvent<HTMLElement>) => void;
}

export default IChartComponentProps;
