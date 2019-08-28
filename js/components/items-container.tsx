import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
// tslint:disable-next-line
import Dynamic from './dynamic';
import { checkBooleanString } from './utils/DataUtils';

import '../../css/items.less';

declare const manywho: any;

interface IItemsContainerState {
    search?: null;
    sortedBy?: string;
    sortedIsAscending?: boolean;
}

class ItemsContainer extends React.Component<IComponentProps, IItemsContainerState> {

    constructor(props: IComponentProps) {
        super(props);
        this.state = { sortedBy: null, sortedIsAscending: null };

        this.onOutcome = this.onOutcome.bind(this);
        this.load = this.load.bind(this);
        this.search = this.search.bind(this);
        this.sort = this.sort.bind(this);
        this.refresh = this.refresh.bind(this);
        this.select = this.select.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.onPaginate = this.onPaginate.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onFirstPage = this.onFirstPage.bind(this);
    }

    onOutcome(objectDataId: string, outcomeId: string) {
        if (this.props.isDesignTime) {
            return;
        }

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const objectData = manywho.component.getSelectedRows(model, [objectDataId]);

        this.updateState(objectData, false);

        const outcome = manywho.model.getOutcome(outcomeId, this.props.flowKey);
        manywho.component.onOutcome(outcome, objectData, this.props.flowKey);
    }

    onPaginate(page) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        state.page = page;
        manywho.state.setComponent(this.props.id, state, this.props.flowKey, true);

        if (model.objectDataRequest || model.fileDataRequest) {
            this.load();
        } else if (
            model.attributes.pagination &&
            manywho.utils.isEqual(model.attributes.pagination, 'true', true)
        ) {
            this.forceUpdate();
        }
    }

    onNext() {
        let page = manywho.state.getComponent(this.props.id, this.props.flowKey).page || 1;
        page += 1;
        this.onPaginate(page);
    }

    onPrev() {
        let page = manywho.state.getComponent(this.props.id, this.props.flowKey).page || 1;
        page -= 1;
        this.onPaginate(Math.max(1, page));
    }

    onFirstPage() {
        this.onPaginate(1);
    }

    areBulkActionsDefined(outcomes): boolean {
        if (outcomes) {
            return outcomes.filter(outcome => outcome.isBulkAction).length > 0;
        }

        return false;
    }

    updateState(objectData: any[], clearSearch: boolean) {
        const newState: any = {
            objectData,
        };

        if (clearSearch) {
            newState.search = null;
        }

        manywho.state.setComponent(this.props.id, newState, this.props.flowKey, true);
    }

    load() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        let limit: number = manywho.settings.global(`paging.${model.componentType.toLowerCase()}`);
        const paginationSize: number = parseInt(model.attributes.paginationSize, 10);

        if (!isNaN(paginationSize)) {
            limit = paginationSize;
        }

        let orderByDirection = null;
        if (!manywho.utils.isNullOrUndefined(this.state.sortedIsAscending)) {
            orderByDirection = this.state.sortedIsAscending ? 'ASC' : 'DESC';
        }

        if (model.objectDataRequest) {
            manywho.engine.objectDataRequest(
                this.props.id,
                model.objectDataRequest,
                this.props.flowKey,
                limit, state.search,
                this.state.sortedBy,
                orderByDirection,
                state.page,
            );
        } else if (model.fileDataRequest) {
            manywho.engine.fileDataRequest(
                this.props.id,
                model.fileDataRequest,
                this.props.flowKey,
                limit,
                state.search,
                null,
                null,
                state.page,
            );
        } else {
            manywho.state.setComponent(
                this.props.id,
                state,
                this.props.flowKey,
                true,
            );
            this.forceUpdate();
        }
    }

    /**
     * Client side sorting of objectData from a List
     *
     * Note, only handles scalar content types, e.g. Objects and Lists are assumed equal.
     *
     * @param sortedBy the key to sort by
     * @param sortedIsAscending true for ASC, otherwise DESC
     * @return int comparison result, -1, 0, 1, for < == or > compare
     */
    compare(sortedBy, sortedIsAscending) {

        return (a, b) => {

            const l = a.properties.find(item => item.developerName === sortedBy);
            const r = b.properties.find(item => item.developerName === sortedBy);

            if (!l || !r) {
                return 0;
            }

            let result = 0;
            switch (l.contentType.toUpperCase()) {
            case manywho.component.contentTypes.datetime: // Fallthrough
            case manywho.component.contentTypes.number: // Fallthrough
            case manywho.component.contentTypes.password: // Fallthrough
            case manywho.component.contentTypes.content: // Fallthrough
            case manywho.component.contentTypes.string:
                result = l.contentValue.localeCompare(r.contentValue);
                break;

            case manywho.component.contentTypes.boolean:
                if (checkBooleanString(l.contentValue) === checkBooleanString(r.contentValue)) {
                    result = 0;
                } else if (checkBooleanString(l.contentValue) && !checkBooleanString(r.contentValue)) {
                    result = -1;
                } else {
                    result = 1;
                }
                break;

            default:
                result = 0;
                break;
            }

            return (sortedIsAscending ? result : (result * -1));
        };
    }

    search(search: string, clearSelection: boolean) {
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        if (clearSelection) {
            this.clearSelection(false);
        }

        state.search = search;
        state.page = 1;

        this.setState({
            sortedBy: null,
            sortedIsAscending: null,
        });

        setTimeout(() => this.load());
    }

    sort(by: string) {
        let isAscending = true;

        if (manywho.utils.isEqual(this.state.sortedBy, by, true)) {
            isAscending = !this.state.sortedIsAscending;
        }

        this.setState({
            sortedIsAscending: isAscending,
            sortedBy: by,
        });

        setTimeout(() => this.load());
    }

    refresh() {
        this.search(null, true);
    }

    select(item: string | Object, clearSearch: boolean) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        let selectedItems = (state.objectData || [])
            .filter(anItem => anItem.isSelected)
            .map(anItem => anItem);

        let selectedItem = null;

        if (typeof item === 'string') {
            [selectedItem] = model.objectData.filter(
                objectData => manywho.utils.isEqual(objectData.internalId, item, true),
            );
        } else if (typeof item === 'object') {
            selectedItem = item;
        }

        // Clone the selected item to remove references to it
        selectedItem = JSON.parse(JSON.stringify(selectedItem));

        const isSelected = selectedItems.filter(
            anItem => anItem.internalId === selectedItem.internalId,
        ).length > 0;

        selectedItem.isSelected = !isSelected;

        if (model.isMultiSelect) {
            if (selectedItem.isSelected) {
                selectedItems.push(selectedItem);
            } else {
                selectedItems = selectedItems.filter(anItem => !manywho.utils.isEqual(anItem.internalId, selectedItem.internalId, true));
            }
        } else if (selectedItem.isSelected) {
            selectedItems = [selectedItem];
        } else {
            selectedItems = [];
        }

        this.updateState(selectedItems, clearSearch);
        manywho.component.handleEvent(
            this,
            manywho.model.getComponent(this.props.id, this.props.flowKey),
            this.props.flowKey,
        );
    }

    selectAll(e, clearSearch: boolean) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        if (state.objectData && state.objectData.length > 0) {
            this.clearSelection(clearSearch);
        } else {
            const selectedItems = model.objectData.map((item) => {
                const clone = JSON.parse(JSON.stringify(item));
                clone.isSelected = true;
                return clone;
            });

            this.updateState(selectedItems, clearSearch);
            manywho.component.handleEvent(
                this,
                manywho.model.getComponent(this.props.id, this.props.flowKey),
                this.props.flowKey,
            );
        }
    }

    clearSelection(clearSearch: boolean) {
        this.updateState([], clearSearch);
        manywho.component.handleEvent(
            this,
            manywho.model.getComponent(this.props.id, this.props.flowKey),
            this.props.flowKey,
        );
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state =
            this.props.isDesignTime ?
                { error: null, loading: null } :
                manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns) || [];

        let hasMoreResults: boolean =
            (model.objectDataRequest && model.objectDataRequest.hasMoreResults) ||
            (model.fileDataRequest && model.fileDataRequest.hasMoreResults);
        let objectData = null;
        let limit = 0;

        if (!model.objectDataRequest && !model.fileDataRequest) {

            if (!manywho.utils.isNullOrWhitespace(state.search)) {
                objectData = model.objectData.filter(
                    item => item.properties.filter((prop) => {
                        const matchingColumns = columns.filter(
                            column => column.typeElementPropertyId === prop.typeElementPropertyId && column.isDisplayValue,
                        );

                        if (matchingColumns && matchingColumns.length > 0 && prop.contentValue) {
                            return manywho.formatting.format(
                                prop.contentValue,
                                prop.contentFormat,
                                prop.contentType,
                                this.props.flowKey,
                            ).toLowerCase().indexOf(state.search.toLowerCase()) !== -1;
                        }

                        return false;
                    }).length > 0,
                );
            } else {
                objectData = model.objectData;
            }

            // Sort the filtered list before slicing
            if (this.state.sortedBy) {
                objectData.sort(this.compare(this.state.sortedBy, this.state.sortedIsAscending));
            }

            if (
                model.attributes.pagination &&
                manywho.utils.isEqual(model.attributes.pagination, 'true', true) &&
                objectData
            ) {
                const page = (state.page - 1) || 0;
                const paginationSize = parseInt(model.attributes.paginationSize, 10);

                limit = parseInt(
                    manywho.settings.flow(
                        `paging.${model.componentType.toLowerCase()}`, this.props.flowKey,
                    ) || 10,
                    10,
                );

                if (!isNaN(paginationSize)) {
                    limit = paginationSize;
                }

                if (limit > 0) {
                    hasMoreResults = (page * limit) + limit + 1 <= objectData.length;
                    objectData = objectData.slice(page * limit, (page * limit) + limit);
                }
            }

        } else if (model.objectDataRequest || model.fileDataRequest) {
            objectData = model.objectData;
            limit = parseInt(
                manywho.settings.flow(
                    `paging.${model.componentType.toLowerCase()}`, this.props.flowKey,
                ) || 10,
                10,
            );
        }

        let contentElement = null;

        if (
            !state.loading &&
            !this.props.isDesignTime &&
            columns.length > 0 &&
            (!objectData || objectData.length === 0)
        ) {
            let noResultsCaption =
                manywho.settings.global('localization.noResults', this.props.flowKey);

            if (model.attributes && !manywho.utils.isNullOrUndefined(model.attributes.noResults)) {
                noResultsCaption = model.attributes.noResults;
            }
            contentElement = (
                <div className="mw-items-empty">
                    <p className="lead">
                        {noResultsCaption}
                    </p>
                </div>
            );
        }

        if (
            model.attributes
            && (manywho.utils.isEqual(model.attributes.onlyDisplaySearchResults, 'true', true) ||
                model.attributes.onlyDisplaySearchResults === true)
            && model.isSearchable
            && manywho.utils.isNullOrWhitespace(state.search)
            && manywho.utils.isNullOrUndefined(objectData)
            && !state.loading
        ) {
            contentElement = (
                <div className="mw-items-search-first">
                    <p className="lead">
                        {
                            manywho.utils.isNullOrWhitespace(
                                model.attributes.onDisplaySearchResultsCaption,
                            ) ?
                                manywho.settings.global(
                                    'localization.searchFirst', this.props.flowKey,
                                ) :
                                model.attributes.onDisplaySearchResultsCaption
                        }
                    </p>
                </div>
            );
        }

        if (columns.length === 0) {
            contentElement = (
                <div className="mw-items-error">
                    <p className="lead">No display columns have been defined</p>
                </div>
            );
        }

        if (state.error) {
            contentElement = (
                <div className="mw-items-error">
                    <p className="lead">{state.error.message}</p>
                    <button className="btn btn-danger" onClick={this.refresh}>Retry</button>
                </div>
            );
        }
        // If contentElement remains null when passed into the child props
        // the child component will decide what gets rendered as the content

        const props = {
            limit,
            outcomes,
            objectData,
            contentElement,
            hasMoreResults,
            id: this.props.id,
            parentId: this.props.parentId,
            flowKey: this.props.flowKey,
            isDesignTime: this.props.isDesignTime,
            onOutcome: this.onOutcome,
            select: this.select,
            selectAll: this.selectAll,
            clearSelection: this.clearSelection,
            onSearch: this.search,
            refresh: this.refresh,
            onNext: this.onNext,
            onPrev: this.onPrev,
            onFirstPage: this.onFirstPage,
            page: state.page || 1,
            isLoading: state.loading !== null && typeof state.loading !== 'undefined',
            sort: this.sort,
            sortedBy: this.state.sortedBy,
            sortedIsAscending: this.state.sortedIsAscending,
        };

        return <Dynamic name={`mw-${model.componentType}`} props={props} />;
    }

}

manywho.component.register(registeredComponents.ITEMS_CONTAINER, ItemsContainer);

export const getItemsContainer = () : typeof ItemsContainer => manywho.component.getByName(registeredComponents.ITEMS_CONTAINER);

export default ItemsContainer;
