import * as React from 'react';
import * as $ from 'jquery';
import { path } from 'ramda'; 
import registeredComponents from '../constants/registeredComponents';
import { getErrorFallback } from './error-fallback';
import IComponentProps from '../interfaces/IComponentProps';
import '../../css/group.less';


declare var manywho: any;

interface IGroupState {
    activeTabIndex: number;
    error: Error;
    componentStack: String;
    hasError: Boolean;
}

const childContainsInvalidItems = (child, flowKey) => {
    if (!manywho.model.isContainer(child)) {
        return !manywho.state.isValid(child.id, flowKey).isValid;
    }

    const items = manywho.model.getChildren(child.id, flowKey);

    for (let i = 0; i < items.length; i = i + 1) {
        if (childContainsInvalidItems(items[i], flowKey))
            return true;
    }

    return false;
};

const clearActivePanes = (tabsElement, panesElement) => {

    const tabElements = path(['children'], tabsElement);
    const paneElements = path(['children'], panesElement);

    if (tabElements instanceof HTMLCollection) {
        Array.from(tabElements).forEach(el => el.classList.remove('active'));
    }

    if (paneElements instanceof HTMLCollection) {
        Array.from(paneElements).forEach(el => el.classList.remove('active'));
    }
};

class Group extends React.Component<IComponentProps, IGroupState> {

    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,
            error: null,
            componentStack: null,
            hasError: false,
        };

        this.onTabSelected = this.onTabSelected.bind(this);
    }

    componentDidCatch(error, { componentStack }) {
        this.setState({ 
            error,
            componentStack,
            hasError: true,
        });
    }

    componentDidMount() {
        this.setActivePane();
    }

    componentDidUpdate() {
        this.setActivePane();
    }

    setActivePane() {
        const tabsElement = this.refs.tabs as HTMLElement;
        const panesElement = this.refs.panes as HTMLElement;
        const activeTabIndex = this.state.activeTabIndex;
        const activeTabElement = path(['children', activeTabIndex], tabsElement);
        const activePaneElement = path(['children', activeTabIndex], panesElement);

        clearActivePanes(tabsElement, panesElement);

        if (activeTabElement instanceof HTMLElement) {
            activeTabElement.classList.add('active');
        }

        if (activePaneElement instanceof HTMLElement) {
            activePaneElement.classList.add('active');
        }
    }

    onTabSelected(index, tabId) {
        const tabElement = this.refs.group as HTMLElement;

        this.setState({ activeTabIndex: index });
        $(tabElement).find(tabId).tab('show');
    }

    render() {

        const {
            error,
            componentStack,
            hasError,
        } = this.state;
        
        const ErrorFallback = getErrorFallback();
        
        if (hasError) {
            return <ErrorFallback error={error} componentStack={componentStack} />;
        }

        const children = manywho.model.getChildren(this.props.id, this.props.flowKey);

        const tabs = children.map((child, index) => {
            let className = null;

            if (
                !this.props.isDesignTime &&
                childContainsInvalidItems(child, this.props.flowKey)
            ) {
                className += ' has-error';
            }

            return <li className={className} key={index}>
                <a id={'tab-' + child.id} href={'#' + child.id}
                    className="control-label"
                    onClick={this.onTabSelected.bind(null, index, 'tab-' + child.id)}
                    data-toggle="tab">
                    {child.label}
                </a>
            </li>;
        });

        if (this.props.isDesignTime)
            return <div className="clearfix">
                {
                    this.props.children ||
                    manywho.component.getChildComponents(
                        children,
                        this.props.id,
                        this.props.flowKey,
                    )
                }
            </div>;

        return <div ref="group">
            <ul className="nav nav-tabs" ref="tabs">{tabs}</ul>
            <div className="tab-content" ref="panes">
                {
                    this.props.children ||
                    manywho.component.getChildComponents(
                        children,
                        this.props.id,
                        this.props.flowKey,
                    )
                }
            </div>
        </div>;
    }

}

manywho.component.registerContainer(registeredComponents.GROUP, Group);

manywho.styling.registerContainer('group', (item, container) => {
    return ['tab-pane', 'label-hidden'];
});

export const getGroup = () : typeof Group => manywho.component.getByName(registeredComponents.GROUP);

export default Group;
