import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import { getNotifications } from './notifications';
import { getNavigation } from './navigation';
import { getStatus } from './status';
import { getFooter } from './footer';
import { getVoting } from './voting';
import { getFeed } from './feed';
import { getWait } from './wait';
import { getDebugViewer } from './debug';
import { getHistory } from './history';
// tslint:disable-next-line
import Dynamic from './dynamic';

declare const manywho: any;

class Main extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.onEnter = this.onEnter.bind(this);
    }

    onEnter = manywho.component.mixins.enterKeyHandler.onEnter;

    componentDidMount() {
        manywho.utils.removeLoadingIndicator('loader');

        if (manywho.settings.global('syncOnUnload', this.props.flowKey, true)) {
            window.addEventListener('beforeunload', this.syncFlow, true);
        }
    }

    /**
     * It is required that we clean up event listeners, otherwise
     * stale sync requests will get sent to the engine for flows
     * that have previously been torn down
     */
    componentWillUnmount() {
        if (manywho.settings.global('syncOnUnload', this.props.flowKey, true)) {
            window.removeEventListener('beforeunload', this.syncFlow, true);
        }
    }

    /**
     * This function exists because we do not want to bind an anonymous
     * function to the beforeunload event listeners, otherwise we cannot remove
     * the event listener when the component later unmounts since the function
     * reference does not exist
     */
    syncFlow = () => {
        manywho.engine.sync(this.props.flowKey);
    }

    render() {
        manywho.log.info('Rendering Main');

        const Navigation = getNavigation();
        const Notifications = getNotifications();
        const Status = getStatus();
        const Footer = getFooter();
        const Voting = getVoting();
        const Feed = getFeed();
        const Wait = getWait();
        const Debug = getDebugViewer();
        const History = getHistory();

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
            fixedFooter = <Footer flowKey={ this.props.flowKey}>
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
                    <Notifications flowKey={this.props.flowKey} position={'bottom'} />
                }
                {
                    <Wait isVisible={state.loading} message={state.loading && state.loading.message} />
                }
                {
                    <Notifications flowKey={this.props.flowKey} position={'left'} />
                }
                {
                    staticComponents.map(component => React.createElement(component, { flowKey: this.props.flowKey }))
                }
                {
                    modal ? <Dynamic name={manywho.component.modalContainer} props={modal} /> : null
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

manywho.component.register(registeredComponents.MAIN, Main);

export const getMain = () : typeof Main => manywho.component.getByName(registeredComponents.MAIN);

export default Main;
