/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IItemsComponentProps.ts" />

declare var manywho: any;

declare var ReactBootstrapTypeahead: any;

interface IDropDownState {
    inputText: string,
    options: Array<any>,
    page: number
}

class DropDown extends React.Component<IItemsComponentProps, IDropDownState> {

    config: any;

    constructor(props) {
        super(props);

        this.config = {
            delay: 750,
            useCache: false,
            clearButton: true,
            minLength: 0
        };

        this.state = {
            inputText: '',
            options: [],
            page: 1
        };

        this.handlePagination = this.handlePagination.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const page = nextProps.page;

        const pagingOutcomes = {
            FIRST: page === 1,
            NOT_CHANGED: page === this.state.page,
            NEXT: page > this.state.page
        };

        const optionsFromProps = this.getOptions(nextProps.objectData);
        const optionsFromState = this.state.options;
        const allOptions = optionsFromState.concat(optionsFromProps);

        const newOptions = pagingOutcomes.FIRST ? optionsFromProps
                            : pagingOutcomes.NOT_CHANGED ? optionsFromState
                            : allOptions;

        this.setState({
            inputText: this.state.inputText,
            options: newOptions,
            page
        });
    }

    getOptions(objectData) {

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);

        if (columns && columns.length > 0) {
            const columnTypeElementPropertyId = columns[0].typeElementPropertyId;

            return objectData === null ? [] : objectData.map((item) => {
                const label = item.properties.filter(function (value) { return manywho.utils.isEqual(value.typeElementPropertyId, columnTypeElementPropertyId, true); })[0];
                return { value: item, label: manywho.formatting.format(label.contentValue, label.contentFormat, label.contentType, this.props.flowKey) };
            });
        }
    }

    // Events

    handleChange(selection) {

        if (selection.length === 0) {
            return this.props.clearSelection();
        }

        this.props.setSelection(selection.map(({ value }) => value));
    }

    handleInputChange(inputText: string) {
        this.setState({ inputText, options: this.state.options, page: this.state.page });
    }

    handleRefresh() {
        this.props.onSearch(this.state.inputText);
    }

    handlePagination() {
        this.props.onNext();
    }

    // Rendering

    renderRefreshButton(isDisabled, isLoading, onRefresh) {
        const refreshClassName = `glyphicon glyphicon-refresh ${isLoading ? 'spin' : ''}`;

        return (
            <button className="btn btn-default refresh-button" onClick={onRefresh} disabled={isDisabled}>
                <span className={refreshClassName} />
            </button>
        );
    }

    renderSelect(options, selectedOptions, isMultiSelect, isDisabled) {
        return (
            <ReactBootstrapTypeahead.AsyncTypeahead
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onSearch={this.props.onSearch}
                options={options}
                selected={selectedOptions}
                multiple={isMultiSelect}
                disabled={isDisabled}
                clearButton={this.config.clearButton}
                delay={this.config.delay}
                useCache={this.config.useCache}
                paginate={this.props.hasMoreResults}
                onPaginate={this.handlePagination}
                minLength={this.config.minLength}
            />
        );
    }

    render() {

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        const options = this.state.options;
        const isMultiSelect = model.isMultiSelect;
        const isDisabled = model.isEnabled === false || this.props.isLoading || model.isEditable === false;
        const isLoading = this.props.isLoading;
        const onRefresh = this.handleRefresh;
        const hasSetWidth = model.width && model.width > 0;

        const containerClassName = `form-group 
                                    ${manywho.styling.getClasses(this.props.parentId, this.props.id, 'select', this.props.flowKey).join(' ')}
                                    ${model.isVisible === false ? ' hidden' : ''}
                                    ${model.isValid === false || state.isValid === false || state.error ? ' has-error' : ''}
                                    `;
        const innerStyle = !hasSetWidth ? {} : {
            width: model.width,
            minWidth: model.width
        };

        let externalIds = [];

        if (this.props.objectData) {

            if (state && state.objectData) {
                externalIds =
                    state.objectData
                    .map((item) => item.externalId);
            } else {
                externalIds =
                    this.props.objectData
                    .filter((item) => item.isSelected)
                    .map((item) => item.externalId);
            }
        }

        const selectedOptions = options
            .filter(option => externalIds.indexOf(option.value.externalId) !== -1);

        const outcomeButtons = this.props.outcomes && this.props.outcomes.map((outcome) => {
                return React.createElement(manywho.component.getByName('outcome'), {
                    id: outcome.id,
                    flowKey: this.props.flowKey,
                });
            }
        );

        return (
            <div className={containerClassName} id={this.props.id}>
                <label>
                    {model.label}
                    {(model.isRequired) ? <span className="input-required"> * </span> : null}
                </label>
                <div style={innerStyle} className={'flex-container'}>
                    { this.renderSelect(options, selectedOptions, isMultiSelect, false) }
                    { this.renderRefreshButton(isDisabled, isLoading, onRefresh) }
                </div>
                <span className="help-block">{(state.error && state.error.message) || model.validationMessage || state.validationMessage}</span>
                <span className="help-block">{model.helpInfo}</span>

                {outcomeButtons}            
            </div>
        );
    }

}

manywho.component.registerItems('select', DropDown);
