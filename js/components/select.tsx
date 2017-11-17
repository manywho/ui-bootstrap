/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IItemsComponentProps.ts" />

import '../../css/select.less';

declare var manywho: any;
declare var reactSelectize: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

class DropDown extends React.Component<IItemsComponentProps, IDropDownState> {

    debouncedOnSearch = null;

    constructor(props) {
        super(props);
        this.state = { options: [], search: '', isOpen: false };

        this.getOptions = this.getOptions.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onValuesChange = this.onValuesChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.isScrollLimit = this.isScrollLimit.bind(this);

        this.debouncedOnSearch = manywho.utils.debounce(this.props.onSearch, 750);
    }

    getOptions(objectData) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);

        if (columns && columns.length > 0) {
            const columnTypeElementPropertyId = columns[0].typeElementPropertyId;

            return objectData.map((item) => {

                const label = item.properties.filter((value) => { 
                    return manywho.utils.isEqual(
                        value.typeElementPropertyId, 
                        columnTypeElementPropertyId, 
                        true,
                    ); 
                })[0];

                return { 
                    value: item, 
                    label: manywho.formatting.format(
                        label.contentValue, 
                        label.contentFormat, 
                        label.contentType, 
                        this.props.flowKey,
                    ),
                };
            });
        }
    }

    onValueChange(option) {
        if (!this.props.isLoading) {
            if (option)
                this.props.select(option.value);
            else
                this.props.clearSelection();

            this.setState({ isOpen: false });
        }
    }

    onValuesChange(options) {
        if (!this.props.isLoading) {
            if (options.length > 0) {
                const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
                this.props.select(options[options.length - 1].value);
            } else {
                this.props.clearSelection();
            }
        }
    }

    onSearchChange(search) {
        if (!this.props.isLoading && this.state.search !== search) {
            this.setState({ search });
            this.debouncedOnSearch(search);
        }
    }

    onOpenChange(isOpen) {
        if (!this.props.isLoading)
            this.setState({ isOpen });
    }

    onFocus() {
        if (!this.props.isLoading)
            this.setState({ isOpen: true });
    }

    onBlur() {
        this.setState({ isOpen: false });
    }

    filterOptions(options, search) {
        return options;
    }

    getUid(option) {
        return option.value.externalId;
    }

    isScrollLimit(e) {
        if (
            e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight && 
            this.props.hasMoreResults
        ) {
            this.props.onNext();
        }
    }

    onWindowBlur = (e) => {
        if (this && this.refs && this.refs['select'])
            (this.refs['select'] as any).blur();
    }

    componentWillReceiveProps(nextProps) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        const doneLoading = this.props.isLoading && !nextProps.isLoading;
        const hasRequest = model.objectDataRequest !== null || model.fileDataRequest !== null;

        if ((doneLoading || !hasRequest) && nextProps.objectData && !nextProps.isDesignTime) {
            let options = [];

            if (
                nextProps.page > 1 && 
                this.state.options.length < nextProps.limit * nextProps.page
            ) {
                options = this.state.options.concat(this.getOptions(nextProps.objectData)),
                    this.setState({ isOpen: true });

                const index = this.state.options.length + 1;

                setTimeout(() => {
                    const dropdown : HTMLDivElement = 
                        (ReactDOM.findDOMNode(this) as HTMLDivElement)
                        .querySelector('.dropdown-menu');
                    const scrollTarget = dropdown.children.item(index) as HTMLElement;
                    dropdown.scrollTop = scrollTarget.offsetTop;
                });
            } else {
                options = this.getOptions(nextProps.objectData);
            }

            if (state && state.objectData) {

                const selectedOptions = state.objectData.filter(
                    item => options.find(option => option.value.externalId === item.externalId),
                );

                if (selectedOptions.length === 0)
                    options = (this.getOptions(state.objectData) || []).concat(options);
            }

            this.setState({ options });
        }

        if (!this.props.isLoading && nextProps.isLoading)
            this.setState({ isOpen: false });

        if (
            this.props.isLoading && 
            !nextProps.isLoading && 
            !manywho.utils.isNullOrWhitespace(this.state.search)
        ) {
            this.setState({ isOpen: true });
        }
    }

    componentWillMount() {
        this.setState({ options: this.getOptions(this.props.objectData || []) });
        window.addEventListener('blur', this.onWindowBlur);
    }

    componentWillUnMount() {
        window.removeEventListener('blur', this.onWindowBlur);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.isOpen && this.state.isOpen) {
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
            const element = (ReactDOM.findDOMNode(this) as HTMLElement);

            if (
                model.attributes && 
                manywho.utils.isEqual(model.attributes.isTethered, 'true', true)
            ) {
                const dropdown: HTMLElement = 
                    document.querySelector('.tether-element .dropdown-menu') as HTMLElement;

                const selectize: HTMLElement = 
                    element.querySelector('.react-selectize') as HTMLElement;

                dropdown.addEventListener('scroll', this.isScrollLimit);
                dropdown.style.setProperty('width', selectize.offsetWidth + 'px');
            } else {
                element.querySelector('.dropdown-menu')
                    .addEventListener('scroll', this.isScrollLimit);
            }
        }
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Select: ${this.props.id}, ${model.developerName}`);

        const state = 
            this.props.isDesignTime ? 
            { error: null, loading: null } :
            manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        const props: any = {
            filterOptions: this.filterOptions,
            uid: this.getUid,
            search: this.state.search,
            open: this.state.isOpen,
            theme: 'default',
            placeholder: model.hintValue,
            ref: 'select',
        };

        if (!this.props.isDesignTime) {
            props.onValueChange = this.onValueChange;
            props.onValuesChange = this.onValuesChange;
            props.onSearchChange = this.onSearchChange;
            props.onOpenChange = this.onOpenChange;
            props.onBlur = this.onBlur;
            props.onFocus = this.onFocus;
            props.value = null;
            props.options = this.state.options;
            props.disabled = (model.isEnabled === false || model.isEditable === false);

            if (
                model.attributes && 
                manywho.utils.isEqual(model.attributes.isTethered, 'true', true)
            ) {
                props.tether = true;
            }

            if (this.props.objectData) {

                let externalIds = null;

                if (state && state.objectData)
                    externalIds = state.objectData.map(item => item.externalId);
                else
                    externalIds = this.props.objectData.filter(item => item.isSelected)
                        .map(item => item.externalId);

                let values = null;

                if (externalIds && externalIds.length > 0)
                    values = 
                        this.state.options
                        .filter(option => externalIds.indexOf(option.value.externalId) !== -1);

                if (values)
                    if (!model.isMultiSelect) {
                        props.value = values[0];
                    } else {
                        props.values = values;
                        props.anchor = values[values.length - 1];
                    }
            }
        }

        const selectElement = 
            model.isMultiSelect ? 
            <reactSelectize.MultiSelect {...props} /> : 
            <reactSelectize.SimpleSelect {...props} />;

        let refreshButton = null;
        if (model.objectDataRequest || model.fileDataRequest) {
            let className = 'glyphicon glyphicon-refresh';

            let isDisabled = false;
            if (model.isEnabled === false || this.props.isLoading || model.isEditable === false)
                isDisabled = true;

            if (this.props.isLoading)
                className += ' spin';

            refreshButton = (
                <button className="btn btn-default refresh-button" 
                    onClick={this.props.refresh} 
                    disabled={isDisabled}>
                    <span className={className} />
                </button>
            );
        }

        const outcomeButtons = this.props.outcomes && this.props.outcomes.map((outcome) => {
            return React.createElement(
                manywho.component.getByName('outcome'), 
                { id: outcome.id, flowKey: this.props.flowKey },
            );
        });

        let className = manywho.styling.getClasses(
            this.props.parentId, 
            this.props.id, 
            'select', 
            this.props.flowKey,
        ).join(' ');

        className += ' form-group';

        if (model.isVisible === false)
            className += ' hidden';

        if (model.isValid === false || state.isValid === false || state.error)
            className += ' has-error';

        const style: any = {};
        let widthClassName = null;

        if (model.width && model.width > 0) {
            style.width = model.width + 'px';
            style.minWidth = style.width;
            widthClassName = 'width-specified';
        }

        return <div className={className} id={this.props.id}>
            <label>
                {model.label}
                {(model.isRequired) ? <span className="input-required"> * </span> : null}
            </label>
            <div style={style} className={widthClassName}>
                {selectElement}
                {refreshButton}
            </div>
            <span className="help-block">
            {
                (state.error && state.error.message) || 
                model.validationMessage || 
                state.validationMessage
            }
            </span>
            <span className="help-block">{model.helpInfo}</span>
            {outcomeButtons}
        </div>;
    }
}

manywho.component.registerItems('select', DropDown);

export default DropDown;
