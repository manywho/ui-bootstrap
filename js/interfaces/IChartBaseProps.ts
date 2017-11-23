interface IChartBaseProps {
    isVisible: boolean;
    columns: any[];
    objectData: any[][];
    onClick: Function;
    flowKey: string;
    type: string;
    options: any;
    width: number;
    height: number;
    labels?: string[];
    isLoading?: boolean;
}

export default IChartBaseProps;
