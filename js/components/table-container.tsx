import IPaginationProps from '../interfaces/IPaginationProps';
import IComponentProps from '../interfaces/IComponentProps';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../../css/table.less';

interface ITableContainerState {
    isVisible?: boolean;
    height?: number;
    icon?: string;
    windowWidth?: number;
    sortByOrder?: string;
    lastOrderBy?: string;
    objectData?: any;
    lastSortedBy?: string;
}

interface ITableContainerProps extends IPaginationProps, IComponentProps {
    sort: (event: React.SyntheticEvent<HTMLElement>) => void;
    select: (event: React.SyntheticEvent<HTMLElement>) => void;
    objectData: any;
    sortedBy: string;
    sortedIsAscending: boolean;
    onOutcome(): void;
    selectAll(): void;
    contentElement: any;
    isLoading: boolean;
    onSearch(): void;
    refresh(): void;
    page: number;
}

class Table extends React.Component<ITableContainerProps, ITableContainerState> {

    handleResizeDebounced = null;

    constructor(props) {
        super(props);

        this.state = {
            isVisible: true,
            height: null,
            icon: 'toggle-icon glyphicon glyphicon-triangle-bottom',
            windowWidth: window.innerWidth,
            sortByOrder: 'ASC',
            lastOrderBy: '',
            objectData: null,
        };

        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.getLabel = this.getLabel.bind(this);
        this.onHeaderClick = this.onHeaderClick.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.uploadComplete = this.uploadComplete.bind(this);

        this.handleResizeDebounced = manywho.utils.debounce(this.handleResize, 200);
    }

    getDisplayColumns(columns, outcomes) {
        const displayColumns = manywho.component.getDisplayColumns(columns) || [];

        if (outcomes.filter(outcome => !outcome.isBulkAction).length > 0)
            displayColumns.unshift('mw-outcomes');

        return displayColumns;
    }

    renderFooter(
        pageIndex: number, 
        hasMoreResults: boolean, 
        onNext: Function, 
        onPrev: Function, 
        onFirstPage: Function, 
        isDesignTime: boolean,
    ) {
        if (pageIndex > 1 || hasMoreResults)
            return React.createElement(manywho.component.getByName('mw-pagination'), {
                pageIndex,
                hasMoreResults,
                onNext,
                onPrev,
                onFirstPage,
                isDesignTime,
            });

        return null;
    }
        
    toggleVisibility(event) {

        event.preventDefault();

        if (manywho.settings.global('collapsible', this.props.flowKey)) {

            if (this.state.isVisible) {

                this.setState({
                    isVisible: false,
                    height: ReactDOM.findDOMNode(this).clientHeight,
                    icon: 'toggle-icon glyphicon glyphicon-triangle-right',
                });

                requestAnimationFrame(() => {
                    this.setState({ height: 0 });
                });

            } else {

                this.setState({
                    isVisible: true,
                    height: null,
                    icon: 'toggle-icon glyphicon glyphicon-triangle-bottom',
                });

            }
        }
    }

    getLabel(label, required) {

        if (!manywho.utils.isNullOrWhitespace(label)) {

            const labelClasses = 
                manywho.settings.global('collapsible', this.props.flowKey) ? 
                'container-label clickable-section' : 
                'container-label';

            const labelContent = 
                manywho.settings.global('collapsible', this.props.flowKey) && label ? 
                [<i className={this.state.icon}/>, label] : 
                [label];

            if (required) {
                labelContent.push(<span className={'input-required'}> *</span>);
            }

            return (
                <h3 className={ labelClasses } onClick={ this.toggleVisibility }>
                    {labelContent}
                </h3>
            );
        }

        return null;
    }

    onHeaderClick(e) {
        this.props.sort(e.currentTarget.id);
    }

    onSelect(e) {
        e.stopPropagation();
        this.props.select(e.currentTarget.id);
    }

    handleResize() {

        if ((this.state.windowWidth <= 768 && window.innerWidth > 768)
            || (this.state.windowWidth > 768 && window.innerWidth <= 768)) {

            this.setState({ windowWidth: window.innerWidth });
        }
    }

    uploadFile(flowKey, formData, progress) {

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        formData.append('FileDataRequest', JSON.stringify(model.fileDataRequest));

        const tenantId = manywho.utils.extractTenantId(this.props.flowKey);
        const authenticationToken = manywho.state.getAuthenticationToken(this.props.flowKey);

        return manywho.ajax.uploadFile(formData, tenantId, authenticationToken, progress);
    }

    uploadComplete() {

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        manywho.engine.fileDataRequest(
            this.props.id, model.fileDataRequest, 
            this.props.flowKey, 
            manywho.settings.global('paging.table'), 
            state.search, 
            null, 
            null, 
            state.page,
        );
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResizeDebounced);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeDebounced);
    }

    render() {

        manywho.log.info('Rendering Table: ' + this.props.id);

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);            
        const state = 
            this.props.isDesignTime ? 
            { error: null, loading: false } : 
            manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const selectedRows = 
            (state.objectData || []).filter(objectData => objectData.isSelected);

        let props: any = {
            model,
            selectedRows,
            id: this.props.id,
            objectData: this.props.objectData,
            totalObjectData: (!model.objectDataRequest && model.objectData) ? 
                model.objectData.length : 
                null,
            outcomes: outcomes.filter(outcome => !outcome.isBulkAction),
            displayColumns: this.getDisplayColumns(model.columns, outcomes),
            flowKey: this.props.flowKey,
            lastSortedBy: this.state.lastSortedBy,
            sortByOrder: this.state.sortByOrder,
            isFiles: manywho.utils.isEqual(model.componentType, 'files', true),
            isValid: !(model.isValid === false || state.isValid === false || state.error),
            isDesignTime: this.props.isDesignTime,
            sortedBy: this.props.sortedBy,
            sortedIsAscending: this.props.sortedIsAscending,
        };

        if (!this.props.isDesignTime) {
            props = manywho.utils.extend(props, {
                onOutcome: this.props.onOutcome,
                onSelect: this.onSelect,
                selectAll: this.props.selectAll,
                onHeaderClick: this.onHeaderClick,
            });

            if (model.attributes && !model.attributes.isRowSelectionDisabled)
                props.onRowClicked = this.onSelect;
        }

        let contentElement = this.props.contentElement;
        if (!contentElement) {
            contentElement = React.createElement(
                this.state.windowWidth <= 768 ? 
                manywho.component.getByName('mw-table-small') :
                manywho.component.getByName('mw-table-large'),
                props,
            );
        }

        let fileUpload = null;
        if (model.fileDataRequest) {

            fileUpload = React.createElement(
                manywho.component.getByName('file-upload'), 
                {
                    flowKey: this.props.flowKey,
                    id: this.props.id,
                    fileDataRequest: model.fileDataRequest,
                    uploadComplete: this.uploadComplete,
                    upload: this.uploadFile,
                    isChildComponent: true,
                }, 
                null,
            );
        }

        let classNames = 'table-container clear-fix';

        if (this.state.windowWidth <= 768)
            classNames += ' table-container-small';

        if (model.isVisible === false)
            classNames += ' hidden';

        classNames += ' ' + manywho.styling.getClasses(
            this.props.parentId, 
            this.props.id, 
            'table', 
            this.props.flowKey,
        ).join(' ');

        if (model.attributes && model.attributes.classes)
            classNames += ' ' + model.attributes.classes;

        let labelElement = null;
        if (!manywho.utils.isNullOrWhitespace(model.label))
            labelElement = <label>{model.label}</label>;

        let validationElement = null;
        if (!props.isValid)
            validationElement = (
                <div className="has-error">
                    <span className="help-block">
                    {
                        model.validationMessage || state.validationMessage
                    }
                    </span>
                </div>
            );

        let isDisabled = false;
        if (model.isEnabled === false || this.props.isLoading)
            isDisabled = true;

        const headerElement = React.createElement(
            manywho.component.getByName('mw-items-header'), 
            {
                isDisabled,
                flowKey: this.props.flowKey,
                isSearchable: model.isSearchable,
                isRefreshable: (model.objectDataRequest || model.fileDataRequest),
                onSearch: this.props.onSearch,
                outcomes: manywho.model.getOutcomes(this.props.id, this.props.flowKey),
                refresh: this.props.refresh,
            },
        );

        return <div className={classNames} id={this.props.id}>
            {labelElement}
            {validationElement}
            <div className={'clearfix' + (this.state.isVisible ? '' : ' hidden')}>
                {fileUpload}
                {headerElement}
                {contentElement}
                {
                    this.renderFooter(
                        this.props.page, 
                        this.props.hasMoreResults, 
                        this.props.onNext, 
                        this.props.onPrev, 
                        this.props.onFirstPage, 
                        this.props.isDesignTime,
                    )
                }
                {
                    React.createElement(
                        manywho.component.getByName('wait'), 
                        { 
                            isVisible: state.loading,
                            message: state.loading && state.loading.message, 
                            isSmall: true,
                        },
                        null,
                    )
                }
            </div>
        </div>;
    }

}

manywho.component.registerItems('table', Table);
manywho.component.registerItems('files', Table);

export default Table;
