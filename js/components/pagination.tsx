/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    const pagination = React.createClass({

        render: function () {
            manywho.log.info('Rendering Pagination');

            return (<div className="mw-pagination">
                <button className="btn btn-default" onClick={this.props.onFirstPage} disabled={this.props.pageIndex <= 1 || this.props.isDesignTime}><span className="glyphicon glyphicon-backward" /></button>
                <button className="btn btn-default" onClick={this.props.onPrev} disabled={this.props.pageIndex <= 1 || this.props.isDesignTime}><span className="glyphicon glyphicon-chevron-left" /></button>
                <span className="page-counter">{this.props.pageIndex}</span>
                <button className="btn btn-default" onClick={this.props.onNext} disabled={!this.props.hasMoreResults || this.props.isDesignTime}><span className="glyphicon glyphicon-chevron-right" /></button>
            </div>);
        }

    });

    manywho.component.register('mw-pagination', pagination);

} (manywho));
