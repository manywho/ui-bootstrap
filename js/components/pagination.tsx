/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IPaginationProps.ts" />

declare var manywho: any;

(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Pagination: React.SFC<any> = (
        { onFirstPage, pageIndex, isDesignTime, onPrev, onNext, hasMoreResults },
    ) => {

        manywho.log.info('Rendering Pagination');

        return (
            <div className="mw-pagination">
                <button className="btn btn-default" 
                    onClick={onFirstPage} 
                    disabled={pageIndex <= 1 || isDesignTime}
                >
                    <span className="glyphicon glyphicon-backward" />
                </button>
                <button className="btn btn-default" 
                    onClick={onPrev} 
                    disabled={pageIndex <= 1 || isDesignTime}
                >
                    <span className="glyphicon glyphicon-chevron-left" />
                </button>
                <span className="page-counter">{pageIndex}</span>
                <button className="btn btn-default" 
                    onClick={onNext} 
                    disabled={!hasMoreResults || isDesignTime}
                >
                    <span className="glyphicon glyphicon-chevron-right" />
                </button>
            </div>
        );
    };

    manywho.component.register('mw-pagination', Pagination);

} (manywho));
