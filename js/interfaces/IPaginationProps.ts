interface IPaginationProps {
    onFirstPage: Function;
    pageIndex: number;
    onPrev(): void;
    onNext(): void;
    hasMoreResults: boolean;
}

export default IPaginationProps;
