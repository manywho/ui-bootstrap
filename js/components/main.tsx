import * as React from 'react';
import notifications from './notifications';
import navigation from './navigation';
import status from './status';
import footer from './footer';
import voting from './voting';
import feed from './feed';
import wait from './wait';
import debug from './debug';
import history from './history';

declare var manywho: any;

class Main extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.onEnter = this.onEnter.bind(this);
    }

    onEnter = manywho.component.mixins.enterKeyHandler.onEnter;

    componentDidMount() {
        manywho.utils.removeLoadingIndicator('loader');

        if (manywho.settings.global('syncOnUnload', this.props.flowKey, true))
            window.addEventListener('beforeunload', (event) => {
                manywho.engine.sync(this.props.flowKey);
            });
    }

    render() {
        manywho.log.info('Rendering Main');

        const Navigation : typeof navigation = manywho.component.getByName('navigation');
        const Notifications : typeof notifications = manywho.component.getByName('notifications');
        const Status : typeof status = manywho.component.getByName('status');
        const Footer : typeof footer = manywho.component.getByName('footer');
        const Voting : typeof voting = manywho.component.getByName('voting');
        const Feed : typeof feed = manywho.component.getByName('feed');
        const Wait : typeof wait = manywho.component.getByName('wait');
        const Debug : typeof debug = manywho.component.getByName('debug');
        const History : typeof history = manywho.component.getByName('history');

        const children = manywho.model.getChildren('root', this.props.flowKey);
        const outcomes = manywho.model.getOutcomes('root', this.props.flowKey);
        const state = manywho.state.getComponent('main', this.props.flowKey) || {};
        const attributes = manywho.model.getAttributes(this.props.flowKey);
        const componentElements = manywho.component.getChildComponents(
            children, this.props.id, this.props.flowKey,
        );
        const isFixedNav: boolean = manywho.settings.global(
            'navigation.isFixed', this.props.flowKey, true,
        );
        let isFixedFooter: boolean = manywho.settings.global(
            'outcomes.isFixed', this.props.flowKey, false,
        );

        const navElement = <Navigation
            id={manywho.model.getDefaultNavigationId(this.props.flowKey)}
            flowKey={this.props.flowKey}
            isFixed={isFixedNav}
            isFullWidth={manywho.settings.global('isFullWidth', this.props.flowKey, false)}
        />;

        if (
            state && 
            state.loading == null && 
            !manywho.utils.isEqual(
                manywho.model.getInvokeType(this.props.flowKey), 'sync', true,
            )
        ) {
            manywho.component.focusInput(this.props.flowKey);
        }

        let outcomeElements = manywho.component.getOutcomes(outcomes, this.props.flowKey);
        let fixedFooter = null;

        if (attributes != null && typeof attributes.outcomes !== 'undefined')
            isFixedFooter = manywho.utils.isEqual(attributes.outcomes, 'fixed', false);

        if (isFixedFooter) {
            fixedFooter = <Footer flowKey={ this.props.flowKey }>
                {outcomeElements}
            </Footer>;
            outcomeElements = null;
        }

        let classNames = 'main';
        classNames += 
            (manywho.settings.global('isFullWidth', this.props.flowKey, false)) ? 
            ' container-fluid full-width' : 
            ' container';

        if (
            manywho.settings.isDebugEnabled(this.props.flowKey) || 
            manywho.settings.global('history', this.props.flowKey)
        ) {
            classNames += ' auto-width';
        }

        const staticComponents = manywho.settings.global(
            'components.static', this.props.flowKey, [],
        );
        const modal = manywho.model.getModal(this.props.flowKey);

        return (<div className="main-container">
            <div className="main-container-inner">
                {(isFixedNav) ? navElement : null}
                <div className="main-scroller">
                    {(isFixedNav) ? null : navElement}
                    <div className={classNames} onKeyUp={this.onEnter} ref="main">
                        <h2 className="page-label">
                            {manywho.model.getLabel(this.props.flowKey)}
                        </h2>
                        {componentElements}
                        {outcomeElements}
                        {
                            <Status flowKey={ this.props.flowKey } />
                        }
                        {
                            <Voting flowKey={ this.props.flowKey } />
                        }
                        {
                            <Feed flowKey={ this.props.flowKey } />
                        }
                    </div>
                </div>
                {(isFixedFooter) ? fixedFooter : null}
                {
                    <Notifications flowKey={this.props.flowKey} position={'center'} />
                }
                {
                    <Notifications flowKey={this.props.flowKey} position={'right'} />
                }
                {
                    <Wait isVisible={state.loading} message={state.loading && state.loading.message} />
                }
                {
                    <Notifications flowKey={this.props.flowKey} position={'left'} />
                }
                {
                    staticComponents.map(component => React.createElement(
                        component, { flowKey: this.props.flowKey }))
                }
                {
                    modal ? React.createElement(
                        manywho.component.modalContainer, modal) : null
                }
            </div>
            {
                <Debug flowKey={ this.props.flowKey } />
            }
            {
                <History flowKey={ this.props.flowKey } />
            }
        </div>);
    }
}

manywho.component.register('main', Main);

export default Main;
