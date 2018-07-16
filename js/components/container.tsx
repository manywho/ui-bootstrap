import * as React from 'react';
import { presets } from 'react-motion';
// tslint:disable-next-line
import { Collapse } from 'react-collapse';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import { getOutcome } from './outcome';
// tslint:disable-next-line
import Dynamic from './dynamic';
import '../../css/containers.less';


declare var manywho: any;

interface IContainerState {
    isCollapsed: boolean;
}

class Container extends React.Component<IComponentProps, IContainerState> {

    constructor(props) {
        super(props);

        this.state = { isCollapsed: false };

        this.isCollapsible = this.isCollapsible.bind(this);
        this.getCollapseGroupKey = this.getCollapseGroupKey.bind(this);
        this.getCollapseGroup = this.getCollapseGroup.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    isCollapsible(model) {
        if (model.attributes && model.attributes.isCollapsible != null)
            return manywho.utils.isEqual(model.attributes.isCollapsible, 'true', true);

        const isCollapsible = manywho.settings.global('collapsible', this.props.flowKey, null);

        if (isCollapsible === null)
            return false;

        if (typeof isCollapsible === 'boolean')
            return isCollapsible;

        if (typeof isCollapsible === 'object') {
            const settings = 
                isCollapsible[model.containerType.toLowerCase()] || isCollapsible.default;
            if (settings)
                return settings.enabled;
        }

        return false;
    }

    getCollapseGroupKey(group) {
        return `${group}
            -${manywho.utils.extractTenantId(this.props.flowKey)}
            -${manywho.utils.extractFlowId(this.props.flowKey)}
            -${manywho.utils.extractFlowVersionId(this.props.flowKey)}`;
    }

    getCollapseGroup(model) {
        const collapsible = manywho.settings.global('collapsible', this.props.flowKey, false);
        let settings = null;

        if (typeof collapsible === 'object')
            settings = collapsible[model.containerType.toLowerCase()] || collapsible.default;

        if (settings && settings.group)
            return settings.group;

        if (model.attributes && model.attributes.collapseGroup != null)
            return model.attributes.collapseGroup;

        return null;
    }

    onToggle(e) {
        this.setState({ isCollapsed: !this.state.isCollapsed });

        const model = manywho.model.getContainer(this.props.id, this.props.flowKey);
        const collapseGroup = this.getCollapseGroup(model);

        if (collapseGroup) {
            localStorage.setItem(
                this.getCollapseGroupKey(collapseGroup), 
                JSON.stringify(!this.state.isCollapsed),
            );
            manywho.engine.render(this.props.flowKey);
        }
    }

    componentWillMount() {
        const model = manywho.model.getContainer(this.props.id, this.props.flowKey);
        const collapseGroup = this.getCollapseGroup(model);
        let isCollapsed = null;

        if (collapseGroup) {
            const isGroupCollapsed = 
                localStorage.getItem(this.getCollapseGroupKey(collapseGroup));

            if (!manywho.utils.isNullOrWhitespace(isGroupCollapsed))
                isCollapsed = JSON.parse(isGroupCollapsed);
        }

        if (isCollapsed == null)
            if (model.attributes && model.attributes.isCollapsed != null)
                isCollapsed = manywho.utils.isEqual(model.attributes.isCollapsed, 'true', true);

        if (isCollapsed == null) {
            const collapsible = 
                manywho.settings.global('collapsible', this.props.flowKey, false);
                
            if (typeof collapsible === 'object') {
                const settings = 
                    collapsible[model.containerType.toLowerCase()] || collapsible.default;
                if (settings)
                    isCollapsed = settings.collapsed;
            }
        }

        this.setState({ isCollapsed });
    }

    componentWillReceiveProps(nextProps) {
        const model = manywho.model.getContainer(this.props.id, this.props.flowKey);
        const collapseGroup = this.getCollapseGroup(model);

        if (collapseGroup) {
            const isGroupCollapsed = 
                localStorage.getItem(this.getCollapseGroupKey(collapseGroup));

            if (!manywho.utils.isNullOrWhitespace(isGroupCollapsed))
                this.setState({ isCollapsed: JSON.parse(isGroupCollapsed) });
        }
    }

    render() {
        const model = manywho.model.getContainer(this.props.id, this.props.flowKey);

        manywho.log.info(
            `Rendering ${model.containerType} 
            Container: ${this.props.id}, 
            ${model.developerName}`,
        );

        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        
        const Outcome = getOutcome(); 
        
        const outcomeButtons = outcomes && outcomes.map((outcome) => {
            return <Outcome id={outcome.id} flowKey={this.props.flowKey} key={outcome.id} />;
        });
        const isCollapsible = this.isCollapsible(model);
        let label = null;

        if (model.label) {
            label = <h3>{model.label}</h3>;

            if (isCollapsible) {
                const toggleIcon = (this.state.isCollapsed) ? 'plus' : 'minus';
                label = <h3 onClick={this.onToggle}>
                    <span className={`glyphicon glyphicon-${toggleIcon}`} />
                    {model.label}
                </h3>;
            }
        }

        let className = manywho.styling.getClasses(
            this.props.parentId, 
            this.props.id, 
            model.containerType, 
            this.props.flowKey,
        ).join(' ');
        className += ' mw-container';

        if (!this.props.isDesignTime && !model.isVisible)
            className += ' hidden';

        let content = null;

        if (isCollapsible && model.label)
            content = (
                <Collapse 
                    isOpened={!this.state.isCollapsed} 
                    springConfig={presets.gentle}>
                    <Dynamic name={`mw-${model.containerType}`} props={this.props} />
                    { outcomeButtons }
                </Collapse>
            );
        else
            content = [
                <Dynamic name={`mw-${model.containerType}`} props={this.props} key={'container'} />,
                outcomeButtons,         
            ];

        return <div className={className} id={this.props.id}>
            {label}
            {content}
        </div>;
    }

}

manywho.component.register(registeredComponents.CONTAINER, Container);

export const getContainer = () : typeof Container => manywho.component.getByName(registeredComponents.CONTAINER) || Container;

export default Container;
