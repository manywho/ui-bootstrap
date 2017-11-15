interface IChartBaseProps {
    isVisible: boolean;
    columns: any[];
    objectData: any[][];
    labels: string[];
    onClick: Function;
    flowKey: string;
    type: string;
    options: any;
    width: number;
    height: number;
    isLoading: boolean;
}
