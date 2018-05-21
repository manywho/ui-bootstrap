import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';

import '../../css/pagination.less';

declare var manywho: any;

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

manywho.component.register(registeredComponents.PAGINATION, Pagination);

export const getPagination = () : typeof Pagination => {
    return manywho.component.getByName(registeredComponents.PAGINATION);
};

export default Pagination;
