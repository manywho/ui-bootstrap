import INavigationProps from '../interfaces/INavigationProps';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../../css/navigation.less';

declare var manywho: any;

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

    getHeaderElement(id, navigation) {
        const children = [
            <button className="navbar-toggle collapsed" 
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
            children.push(<a className="navbar-brand" href="#">{navigation.label}</a>);

        return <div className="navbar-header">{children}</div>;
    }

    getNavElements(items, isTopLevel) {
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

                if (isTopLevel === false) {
                    classNames.push('dropdown-submenu');
                }

                element = <li className={classNames.join(' ')}>
                    <a href="#" id={item.id} className="dropdown-toggle" data-toggle="dropdown">
                        {item.label}
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                        {this.getNavElements(item.items, false)}
                    </ul>
                </li>;
            } else {
                element = <li className={classNames.join(' ')}>
                    <a href="#" onClick={this.onClick.bind(null, item)} id={item.id}>
                        {item.label}
                    </a>
                </li>;
            }

            elements.push(element);
        }

        return elements;
    }

    onClick(item) {

        const toggleButton : HTMLButtonElement = 
            this.refs.toggle ?
            ReactDOM.findDOMNode(this.refs.toggle) :
            null;


        if (!item.isEnabled)
            return false;

        if (
            this.refs.toggle && 
            manywho.utils.isEqual(
                window.getComputedStyle(toggleButton).display, 'none', true)
        ) {
            toggleButton.click();
        }

        manywho.engine.navigate(this.props.id, item.id, null, this.props.flowKey);
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
                                <li onClick={this.onClick.bind(null, item)} 
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

manywho.component.register('navigation', Navigation);

export default Navigation;
