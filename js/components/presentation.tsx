import * as React from 'react';
import { findDOMNode } from 'react-dom';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
import { renderOutcomesInOrder } from './utils/CoreUtils';

// Can't use import otherwise the Jest tests fail to find DOMPurify
const createDOMPurify = require('dompurify');

const DOMPurify = createDOMPurify(window);

declare var manywho: any;

class Presentation extends React.Component<IComponentProps, null> {

    html = null;

    replaceContent() {
        const node = findDOMNode(this.refs.content);

        const imgs = node.querySelectorAll('img');
        if (imgs && imgs.length > 0)
            for (let i = 0; i < imgs.length; i += 1) {
                imgs[i].className += ' img-responsive';
            }
    }

    componentDidUpdate() { this.replaceContent(); }
    componentDidMount() { this.replaceContent(); }

    // Enzyme/Jest do not render dangerouslySetInnerHTML with mount or shallow, so to allow
    // testing provide access to the rendered html
    forTestingOnly() {
        return this.html;
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Presentation: ${this.props.id}, ${model.developerName}`);

        const Outcome = getOutcome();

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes: any = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        const outcomeElements: JSX.Element[] = outcomes && outcomes
            .map(outcome => <Outcome key={outcome.id} id={outcome.id} flowKey={this.props.flowKey}/>);

        let className = manywho.styling.getClasses(
            this.props.parentId,
            this.props.id,
            'presentation',
            this.props.flowKey,
        ).join(' ');

        if (model.isVisible === false) {
            className += ' hidden';
        }

        this.html = model.content;

        if (!manywho.utils.isNullOrUndefined(this.html)) {
            // Undo some escaping applied by the API.
            this.html = this.html.replace(/&quot;/g, '\"')
                .replace(/&#39;/g, '\'')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');

            // By default, do not strip any dangerous Javascript, to avoid breaking existing Flows without this Player setting
            // The default player, for new customers/flows, will have this setting enabled by default.
            // Allow an optional DOMPurify config to allow/disallow certain tags or attributes.
            if (manywho.settings.global('disableScripting', this.props.flowKey, false)) {
                this.html = DOMPurify.sanitize(this.html, manywho.settings.global('disableScriptingConfiguration', this.props.flowKey, null));
                if (DOMPurify.removed && DOMPurify.removed.length > 0) {
                    // Notify someone so we can identify Flows that have been affected, which
                    // may not be desirable for some customers.
                    console.error(`Scripting removed from Presentation: ${this.props.id}, Name: ${model.developerName} Content: ${model.content}`);
                }
            }
        }

        const presentationField = (
            <div>
                <label>{model.label}</label>
                <div ref="content" dangerouslySetInnerHTML={{ __html: this.html }} />
                <span className="help-block">
                    {model.validationMessage || state.validationMessage}
                </span>
                <span className="help-block">{model.helpInfo}</span>
            </div>
        );

        return (
            <div className={className} id={this.props.id}>
                {renderOutcomesInOrder(presentationField, outcomeElements, outcomes, model.isVisible)}
            </div>
        );
    }

}

manywho.component.register(registeredComponents.PRESENTATION, Presentation);

export const getPresentation = () : typeof Presentation => manywho.component.getByName(registeredComponents.PRESENTATION);

export default Presentation;
