import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import '../../css/group.less';


declare var manywho: any;

interface IGroupState {
    activeTabIndex: number;
}

function childContainsInvalidItems(child, flowKey) {
    if (!manywho.model.isContainer(child)) {
        return !manywho.state.isValid(child.id, flowKey).isValid;
    }

    const items = manywho.model.getChildren(child.id, flowKey);

    for (let i = 0; i < items.length; i = i + 1) {
        if (childContainsInvalidItems(items[i], flowKey))
            return true;
    }

    return false;
}

function clearActivePanes(groupContainer) {
    for (let i = 0; i < groupContainer.children.length; i = i + 1) {
        const child = groupContainer.children[i];

        for (let j = 0; j < child.children.length; j = j + 1) {
            child.children[j].classList.remove('active');
        }
    }
}

class Group extends React.Component<IComponentProps, IGroupState> {

    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,
        };

        this.onTabSelected = this.onTabSelected.bind(this);
    }

    componentDidMount() {
        const groupElement = this.refs.group as HTMLElement;

        if (
            !this.props.isDesignTime &&
            groupElement.children[0].children &&
            groupElement.children[0].children.length > 0
        ) {
            clearActivePanes(groupElement);
            groupElement.children[0].children[this.state.activeTabIndex]
                .classList.add('active');

            groupElement.children[1].children[this.state.activeTabIndex]
                .classList.add('active');
        }
    }

    componentDidUpdate() {
        const groupElement = this.refs.group as HTMLElement;

        if (
            !this.props.isDesignTime &&
            groupElement.children[0].children &&
            groupElement.children[0].children.length > 0
        ) {
            clearActivePanes(groupElement);
            groupElement.children[0].children[this.state.activeTabIndex]
                .classList.add('active');

            groupElement.children[1].children[this.state.activeTabIndex]
                .classList.add('active');
        }
    }

    onTabSelected(index, tabId) {
        const tabElement = this.refs.group as HTMLElement;

        this.setState({ activeTabIndex: index });
        $(tabElement).find(tabId).tab('show');
    }

    render() {
        const children = manywho.model.getChildren(this.props.id, this.props.flowKey);

        const tabs = children.map((child, index) => {
            let className = null;

            if (
                !this.props.isDesignTime &&
                childContainsInvalidItems(child, this.props.flowKey)
            ) {
                className += ' has-error';
            }

            return <li className={className}>
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
            <div className="tab-content">
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
