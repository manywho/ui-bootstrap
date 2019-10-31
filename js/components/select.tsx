import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { MultiSelect, SimpleSelect } from 'react-selectize';
import registeredComponents from '../constants/registeredComponents';
import IItemsComponentProps from '../interfaces/IItemsComponentProps';
import { getOutcome } from './outcome';
import { checkBooleanString } from './utils/DataUtils';
import { renderOutcomesInOrder } from './utils/CoreUtils';

import '../../css/select.less';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

class Select extends React.Component<IItemsComponentProps, IDropDownState> {

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

    componentWillMount() {
        this.setState({ options: this.getOptions(this.props.objectData || []) });
        window.addEventListener('blur', this.onWindowBlur);
    }

    componentDidMount() {
        (findDOMNode(this) as HTMLElement).querySelector('input').classList.add('prevent-submit-on-enter');
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
                options = this.state.options.concat(this.getOptions(nextProps.objectData));
                this.setState({ isOpen: true });

                const index = this.state.options.length + 1;

                setTimeout(() => {
                    const dropdown: HTMLDivElement =
                        (findDOMNode(this) as HTMLDivElement)
                            .querySelector('.dropdown-menu');
                    const scrollTarget = dropdown.children.item(index) as HTMLElement;
                    dropdown.scrollTop = scrollTarget.offsetTop;
                });
            } else {
                options = this.getOptions(nextProps.objectData);
            }

            if (state && state.objectData) {
                // Replace 'selected' item(s) from `this.getOptions()`, in the `options` list.
                // Match on `externalId` or the `internalId` because when offline there is no externalId
                options = options
                    .map(option => this.getOptions(state.objectData)
                        .find(selection => (selection.value.externalId && selection.value.externalId === option.value.externalId) ||
                                            selection.value.internalId === option.value.internalId) || option);
            }

            this.setState({ options });
        }

        if (!this.props.isLoading && nextProps.isLoading) {
            this.setState({ isOpen: false });
        }

        if (
            this.props.isLoading &&
            !nextProps.isLoading &&
            !manywho.utils.isNullOrWhitespace(this.state.search)
        ) {
            this.setState({ isOpen: true });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.isOpen && this.state.isOpen) {

            // Timeout to ensure the dropdown has had a chance to render before accessing it's child elements
            setTimeout(
                () => {
                    const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
                    const element = (findDOMNode(this) as HTMLElement);

                    if (
                        model.attributes &&
                        manywho.utils.isEqual(model.attributes.isTethered, 'true', true)
                    ) {
                        const dropdown: HTMLElement =
                            document.querySelector('.tether-element .dropdown-menu') as HTMLElement;

                        const selectize: HTMLElement =
                            element.querySelector('.react-selectize') as HTMLElement;

                        if (dropdown !== null) {
                            dropdown.addEventListener('scroll', this.isScrollLimit);
                            dropdown.style.setProperty('width', `${selectize.offsetWidth}px`);
                        }

                    } else {
                        element.querySelector('.dropdown-menu')
                            .addEventListener('scroll', this.isScrollLimit);
                    }
                },
                10,
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this.onWindowBlur);
    }

    onValueChange(option) {
        if (!this.props.isLoading) {
            if (option) {
                this.props.select(option.value);
            } else {
                this.props.clearSelection();
            }

            this.setState({ isOpen: false });
        }
    }

    onValuesChange(options) {
        if (!this.props.isLoading) {
            if (options.length > 0) {
                manywho.model.getComponent(this.props.id, this.props.flowKey);
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
        if (!this.props.isLoading) {
            this.setState({ isOpen });
        }
    }

    onFocus() {
        if (!this.props.isLoading) {
            this.setState({ isOpen: true });
        }
    }

    onBlur() {
        this.setState({ isOpen: false });
    }

    onWindowBlur = (e) => {
        if (this && this.refs && this.refs['select']) {
            (this.refs['select'] as any).blur();
        }
    }

    getOptions(objectData) {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);

        if (columns && columns.length > 0) {
            const columnTypeElementPropertyId = columns[0].typeElementPropertyId;

            return objectData.map((item) => {

                const labelProperty = item.properties.find((value) => {
                    return manywho.utils.isEqual(
                        value.typeElementPropertyId,
                        columnTypeElementPropertyId,
                        true,
                    );
                });

                if (!labelProperty) {
                    manywho.log.error(
                        `columnTypeElementPropertyId ${columnTypeElementPropertyId} cannot be found in objectData item:`,
                        item,
                    );
                }

                const optionText = labelProperty
                    ? manywho.formatting.format(
                        labelProperty.contentValue,
                        labelProperty.contentFormat,
                        labelProperty.contentType,
                        this.props.flowKey,
                    )
                    : '';

                return {
                    value: item,
                    label: optionText,
                };
            });
        }

        return [];
    }

    getUid(option) {
        return option.value.internalId;
    }

    isScrollLimit(e) {
        if (
            e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight &&
            this.props.hasMoreResults
        ) {
            this.props.onNext();
        }
    }

    filterOptions(options) {
        return options;
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        const Outcome = getOutcome();

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

            // If a multiselect is used then the values prop
            // must always be set on re-render as react selectize will
            // just reuse a previously selected value if no new values
            // are given back by the engine (e.g if an operator clears out the values).
            // I have just wrapped it in a condition just in case adding the values prop
            // for a simple select causes some kind of conflict.
            if (model.isMultiSelect) {
                props.values = [];
            }

            if (
                model.attributes &&
                manywho.utils.isEqual(model.attributes.isTethered, 'true', true)
            ) {
                props.tether = true;
            }

            if (this.props.objectData) {

                let internalIds = null;

                if (state && state.objectData) {
                    internalIds = state.objectData.map(item => item.internalId);
                } else {
                    internalIds = this.props.objectData.filter(item => item.isSelected)
                        .map(item => item.internalId);
                }
                let values = null;

                if (internalIds && internalIds.length > 0) {
                    values = this.state.options.filter(option => internalIds.indexOf(option.value.internalId) !== -1);
                }

                if (values) {
                    if (!model.isMultiSelect) {
                        props.value = values[0];
                    } else {
                        props.values = values;
                        props.anchor = values[values.length - 1];
                    }
                }
            }
        }

        const selectElement =
            model.isMultiSelect ?
                <MultiSelect {...props} /> :
                <SimpleSelect {...props} />;

        let refreshButton = null;
        if (model.objectDataRequest || model.fileDataRequest) {
            let className = 'glyphicon glyphicon-refresh';

            let isDisabled = false;
            if (model.isEnabled === false || this.props.isLoading || model.isEditable === false) {
                isDisabled = true;
            }

            if (this.props.isLoading) {
                className += ' spin';
            }

            refreshButton = (
                <button
                    className="btn btn-default refresh-button"
                    onClick={this.props.refresh}
                    disabled={isDisabled}>
                    <span className={className} />
                </button>
            );
        }

        const outcomeButtons = this.props.outcomes && this.props.outcomes.map(
            outcome => <Outcome id={outcome.id} flowKey={this.props.flowKey } />,
        );

        let className = manywho.styling.getClasses(
            this.props.parentId,
            this.props.id,
            'select',
            this.props.flowKey,
        ).join(' ');

        className += ' form-group';

        if (model.isVisible === false) {
            className += ' hidden';
        }

        if (model.isValid === false || state.isValid === false || state.error) {
            className += ' has-error';
        }

        const style: any = {};
        let widthClassName = null;

        if (model.width && model.width > 0) {
            style.width = `${model.width}px`;
            style.minWidth = style.width;
            widthClassName = 'width-specified';
        }

        const comboBox = (
            <div className={className} id={this.props.id}>
                <label>
                    {model.label}
                    {checkBooleanString(model.isRequired) ? <span className="input-required"> * </span> : null}
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
            </div>
        );

        return (
            <div>
                {renderOutcomesInOrder(comboBox, outcomeButtons, this.props.outcomes, model.isVisible)}
            </div>
        );
    }
}

manywho.component.registerItems(registeredComponents.SELECT, Select);

export const getSelect = () : typeof Select => manywho.component.getByName(registeredComponents.SELECT);

export default Select;
