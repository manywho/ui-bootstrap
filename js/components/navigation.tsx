import * as React from 'react';
import { findDOMNode } from 'react-dom';
import INavigationProps from '../interfaces/INavigationProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/navigation.less';

declare var manywho: any;
const menuRefs = [];

class Navigation extends React.Component<INavigationProps, null> {

    getItem(items: any, id: string) {
        for (const itemId in items) {
            if (itemId === id) {
                return items[id];
            }

            const item = items[itemId];
            if (item.items) {
                const foundItem = this.getItem(item.items, id);
                if (foundItem)
                    return foundItem;
            }

        }
    }

    getHeaderElement(id: string, navigation: { label: string; }) {
        const children = [
            <button className="navbar-toggle collapsed"
                key={'toggle'}
                data-toggle="collapse"
                data-target={'#' + id}
                ref="toggle">
                <span className="sr-only">Toggle Navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
            </button>,
        ];

        if (navigation.label != null && navigation.label.trim().length > 0)
            children.push(<a className="navbar-brand" href="#" key={'brand'}>{navigation.label}</a>);

        return <div className="navbar-header">{children}</div>;
    }

    getNavElements(items: any, isTopLevel: boolean) {
        const elements = [];

        for (const itemId in items) {
            const item = items[itemId];
            let element = null;

            const classNames = [
                (item.isCurrent) ? 'active' : '',
                (item.isVisible === false) ? 'hidden' : '',
                (item.isEnabled) ? '' : 'disabled',
                (isTopLevel) ? 'top-nav-element' : '',
            ];

            if (item.items != null) {

                const ref = React.createRef<HTMLInputElement>();
                menuRefs.push(ref);

                if (isTopLevel === false) {
                    classNames.push('dropdown-submenu');
                }

                element = <li onClick={(e) => this.onSubMenuClick(e, ref)} ref={ref} className={classNames.join(' ')} key={item.id}>
                    <a href="#" id={item.id} className="dropdown-toggle">
                        {item.label}
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                        {this.getNavElements(item.items, false)}
                    </ul>
                </li>;
            } else {
                element = <li className={classNames.join(' ')} key={item.id}>
                    <a href="#" onClick={this.onClick.bind(this, item)} id={item.id}>
                        {item.label}
                    </a>
                </li>;
            }

            elements.push(element);
        }

        return elements;
    }

    onSubMenuClick = (e, ref) => {
        e.stopPropagation();
        e.preventDefault();
        ref.current.classList.toggle('open');
    };

    onDocumentClick = (e) => {
        menuRefs.forEach((item) => {
            if (item.current && !item.current.contains(e.target) && item.current.classList.contains('open')) {
                item.current.classList.toggle('open');
            }
        });
    }

    onClick(item: { isEnabled: boolean; id: string; }) {

        const toggleButton : HTMLButtonElement =
            this.refs.toggle ?
            findDOMNode(this.refs.toggle) :
            null;


        if (!item.isEnabled)
            return false;

        if (
            this.refs.toggle &&
            !manywho.utils.isEqual(
                window.getComputedStyle(toggleButton).display, 'none', true)
        ) {
            toggleButton.click();
        }

        manywho.engine.navigate(this.props.id, item.id, null, this.props.flowKey);
    }

    componentDidMount() {
        document.addEventListener('click', this.onDocumentClick);
    }

    render() {
        const navigation = manywho.model.getNavigation(this.props.id, this.props.flowKey);

        if (navigation && navigation.isVisible) {

            manywho.log.info('Rendering Navigation');

            let navElements = this.getNavElements(navigation.items, true);

            navElements = navElements.concat(
                manywho.settings.global('navigation.components') || [],
            );
            navElements = navElements.concat(
                manywho.settings.flow('navigation.components', this.props.flowKey) || [],
            );

            const returnToParent = navigation.returnToParent || null;

            if (!manywho.settings.global('navigation.isWizard', this.props.flowKey, true)) {
                let innerClassName = '';

                if (!this.props.isFullWidth)
                    innerClassName += ' container';

                return (<nav className="navbar navbar-default" ref="navigationBar">
                    <div className={innerClassName}>
                        {this.getHeaderElement(this.props.id, navigation)}
                        <div className="collapse navbar-collapse"
                            id={this.props.id} ref="container">
                            <ul className="nav navbar-nav">
                                {navElements}
                            </ul>
                            {returnToParent}
                        </div>
                    </div>
                </nav>);
            }

            return <div className="navbar-wizard">
                {
                    !manywho.utils.isNullOrWhitespace(navigation.label) ?
                    <span className="navbar-brand">{navigation.label}</span> :
                    null
                }
                <ul className="steps">
                    {manywho.utils.convertToArray(navigation.items)
                        .filter(item => item.isVisible)
                        .map((item) => {
                            let className = null;

                            if (item.isCurrent)
                                className += ' active';

                            if (item.isEnabled === false)
                                className += ' disabled';

                            if (item.tags) {
                                const tag = item.tags.find((tag) => {
                                    return manywho.utils.isEqual(
                                        tag.developerName, 'isComplete', true,
                                    );
                                });
                                if (tag && manywho.utils.isEqual(
                                    tag.contentValue, 'false', true,
                                )) {
                                    className += ' active';
                                }
                            }

                            return (
                                <li onClick={this.onClick.bind(this, item)}
                                    key={item.id}
                                    id={item.id}
                                    className={className}>
                                    <span className="indicator" />
                                    <span className="glyphicon glyphicon-ok" />
                                    {item.label}
                                </li>
                            );
                        })}
                </ul>
                {returnToParent}
            </div>;
        }

        return null;
    }

}

manywho.component.register(registeredComponents.NAVIGATION, Navigation);

export const getNavigation = () : typeof Navigation => manywho.component.getByName(registeredComponents.NAVIGATION) || Navigation;

export default Navigation;
