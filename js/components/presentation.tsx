/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    const presentation = React.createClass({

        replaceContent: function () {
            const node = ReactDOM.findDOMNode(this.refs.content);

            const imgs = node.querySelectorAll('img');
            if (imgs && imgs.length > 0)
                for (let i = 0; i < imgs.length; i++) {
                    imgs[i].className += ' img-responsive';
                }
        },

        componentDidUpdate: function () { this.replaceContent(); },
        componentDidMount: function () { this.replaceContent(); },

        render: function () {
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            manywho.log.info(`Rendering Presentation: ${this.props.id}, ${model.developerName}`);

            const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
            const outcomes: any = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
            const outcomeElements: Array<JSX.Element> = outcomes && outcomes
                .map((outcome) => React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey }));

            let className = (manywho.styling.getClasses(this.props.parentId, this.props.id, 'presentation', this.props.flowKey)).join(' ');

            if (model.isVisible === false)
                className += ' hidden';

            let html = model.content;

            if (!manywho.utils.isNullOrUndefined(html))
                html = html.replace(/&quot;/g, '\"')
                    .replace(/&#39;/g, '\'')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&');

            return <div className={className} id={this.props.id}>
                <label>{model.label}</label>
                <div ref="content" dangerouslySetInnerHTML={{ __html: html }} />
                <span className="help-block">{model.validationMessage || state.validationMessage}</span>
                <span className="help-block">{model.helpInfo}</span>
                {outcomeElements}
            </div>;
        }

    });

    manywho.component.register('presentation', presentation);

} (manywho));
