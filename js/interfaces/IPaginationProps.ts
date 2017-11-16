interface IPaginationProps {
    onFirstPage: Function;
    pageIndex: number;
    isDesignTime: boolean;
    onPrev(): void;
    onNext(): void;
    hasMoreResults: boolean;
}
