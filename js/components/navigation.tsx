import * as React from 'react';
import INavigationProps from '../interfaces/INavigationProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/navigation.less';

declare const manywho: any;

// Holds the refs for each dropdown navigation item
// so that their open/closed state can be altered
const menuRefs = [];
const toggleRef = React.createRef<HTMLButtonElement>();

/**
 * @description The navigation component renders a Bootstrap 3
 * Navbar populated with menu items. Menu items may have children and
 * grand children etc which are displayed by clicking the parent navigation
 * items.
 * We are not using Bootstraps JS for handling dropdown toggle state,
 * as in v3, Bootstrap had removed support for mobile friendly sub-navigation.
 */
class Navigation extends React.Component<INavigationProps, null> {

    componentDidMount() {
        document.addEventListener('click', this.onDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onDocumentClick);
    }

    // Concerns toggling a dropdowns sub menu
    onSubMenuClick = (e, ref) => {
        e.stopPropagation();
        e.preventDefault();
        ref.current.classList.toggle('open');
    };

    // This is for ensuring dropdown navigation is hidden when
    // parts of the document other than the dropdown are clicked
    onDocumentClick = (e) => {
        menuRefs.forEach((item) => {
            if (item.current && !item.current.contains(e.target) && item.current.classList.contains('open')) {
                item.current.classList.toggle('open');
            }
        });
    }

    // Concerns navigating the Flow if the navigation
    // item clicked has not got a sub menu
    onClick(item: { isEnabled: boolean; id: string; }) {

        if (!item.isEnabled) {
            return false;
        }

        if (
            toggleRef.current &&
            !manywho.utils.isEqual(window.getComputedStyle(toggleRef.current).display, 'none', true)
        ) {
            toggleRef.current.click();
        }

        manywho.engine.navigate(this.props.id, item.id, null, this.props.flowKey);
        return true;
    }

    getItem(items: any, id: string) {
        return items.map((itemId) => {
            if (itemId === id) {
                return items[id];
            }

            const item = items[itemId];
            if (item.items) {
                const foundItem = this.getItem(item.items, id);
                if (foundItem) {
                    return foundItem;
                }
            }

            return null;
        });
    }

    getHeaderElement(id: string, navigation: { label: string; }) {
        const children = [
            <button
                className="navbar-toggle collapsed"
                key="toggle"
                data-toggle="collapse"
                data-target={`#${id}`}
                ref={toggleRef}
            >
                <span className="sr-only">Toggle Navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
            </button>,
        ];

        if (navigation.label != null && navigation.label.trim().length > 0) {

            /* eslint-disable jsx-a11y/anchor-is-valid */
            // TODO: Generate a join URI to anchor to the brand element
            children.push(<a className="navbar-brand" href="#" key="brand">{navigation.label}</a>);
        }

        return <div className="navbar-header">{children}</div>;
    }

    getNavElements(items: any, isTopLevel: boolean) {
        const elements = [];

        Object.keys(items).forEach((itemId) => {
            const item = items[itemId];
            let element = null;

            const classNames = [
                (item.isCurrent) ? 'active' : '',
                (item.isVisible === false) ? 'hidden' : '',
                (item.isEnabled) ? '' : 'disabled',
                (isTopLevel) ? 'top-nav-element' : '',
            ];

            if (item.items != null) {

                const ref = React.createRef<HTMLLIElement>();
                menuRefs.push(ref);

                if (isTopLevel === false) {
                    classNames.push('dropdown-submenu');
                }

                element = (
                    <li ref={ref} className={classNames.join(' ')} key={item.id}>
                        <a onClick={e => this.onSubMenuClick(e, ref)} href="#" id={item.id} className="dropdown-toggle">
                            {item.label}
                            <span className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                            {this.getNavElements(item.items, false)}
                        </ul>
                    </li>
                );
            } else {
                element = (
                    <li className={classNames.join(' ')} key={item.id}>
                        <a href="#" onClick={this.onClick.bind(this, item)} id={item.id}>
                            {item.label}
                        </a>
                    </li>
                );
            }
            elements.push(element);
        });

        return elements;
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

                if (!this.props.isFullWidth) {
                    innerClassName += ' container';
                }

                return (
                    <nav className="navbar navbar-default">
                        <div className={innerClassName}>
                            {this.getHeaderElement(this.props.id, navigation)}
                            <div
                                className="collapse navbar-collapse"
                                id={this.props.id}
                            >
                                <ul className="nav navbar-nav">
                                    {navElements}
                                </ul>
                                {returnToParent}
                            </div>
                        </div>
                    </nav>
                );
            }

            return (
                <div className="navbar-wizard">
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

                                if (item.isCurrent) {
                                    className += ' active';
                                }

                                if (item.isEnabled === false) {
                                    className += ' disabled';
                                }

                                if (item.tags) {
                                    const tag = item.tags.find(itemTag => manywho.utils.isEqual(
                                        itemTag.developerName, 'isComplete', true,
                                    ));
                                    if (tag && manywho.utils.isEqual(
                                        tag.contentValue, 'false', true,
                                    )) {
                                        className += ' active';
                                    }
                                }

                                return (
                                    // TODO: Use more accessible elements for navigation items
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                                    <li
                                        onClick={this.onClick.bind(this, item)}
                                        onKeyDown={this.onClick.bind(this, item)}
                                        key={item.id}
                                        id={item.id}
                                        className={className}
                                    >
                                        <span className="indicator" />
                                        <span className="glyphicon glyphicon-ok" />
                                        {item.label}
                                    </li>
                                );
                            })}
                    </ul>
                    {returnToParent}
                </div>
            );
        }

        return null;
    }

}

manywho.component.register(registeredComponents.NAVIGATION, Navigation);

export const getNavigation = () : typeof Navigation => manywho.component.getByName(registeredComponents.NAVIGATION) || Navigation;

export default Navigation;
