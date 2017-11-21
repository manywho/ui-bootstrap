import IItemsHeaderProps from '../interfaces/IItemsHeaderProps';
import * as React from 'react';

import '../../css/items.less';

declare var manywho: any;

interface IItemsHeaderState {
    search: string;
}

class ItemsHeader extends React.Component<IItemsHeaderProps, IItemsHeaderState> {

    constructor(props: IItemsHeaderProps) {
        super(props);

        this.state = { search: null };

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onSearchEnter = this.onSearchEnter.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearchChanged(e) {
        this.setState({ search: e.currentTarget.value });
    }

    onSearchEnter(e) {
        if (e.keyCode === 13) {
            e.stopPropagation();
            this.props.onSearch(this.state.search, false);
        }
    }

    onSearch(e) {
        this.props.onSearch(this.state.search, false);
    }

    render() {
        let search = null;
        let outcomes = null;
        let refresh = null;

        if (this.props.isSearchable)
            search = <div className="mw-items-header-search input-group">
                <input className="form-control" 
                    value={this.state.search} 
                    onChange={this.onSearchChanged} 
                    onKeyUp={this.onSearchEnter} 
                    placeholder="Search" 
                />
                <span className="input-group-btn">
                    <button className="btn btn-default" onClick={this.onSearch}>
                        <span className="glyphicon glyphicon-search" />
                    </button>
                </span>
            </div>;

        if (this.props.outcomes) {
            outcomes = <div className="mw-items-header-outcomes">
                {
                    this.props.outcomes
                    .filter(outcome => outcome.isBulkAction)
                    .map((outcome) => {
                        return React.createElement(
                            manywho.component.getByName('outcome'), 
                            { id: outcome.id, flowKey: this.props.flowKey },
                        );
                    })
                }
            </div>;
        }

        refresh = (
            <button className="btn btn-sm btn-default" 
                onClick={this.props.refresh} 
                disabled={this.props.isDisabled}>
                <span className="glyphicon glyphicon-refresh" />
            </button>
        );

        return (<div className="mw-items-header">
            {search}
            {refresh}
            {outcomes}
        </div>);
    }

}

manywho.component.register('mw-items-header', ItemsHeader);

export default ItemsHeader;
