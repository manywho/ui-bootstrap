import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import { getErrorFallback } from './error-fallback';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

class Vertical extends React.Component<IComponentProps> {

    state = {
        error: null,
        componentStack: null,
        hasError: false,
    };

    componentDidCatch(error, { componentStack }) {
        this.setState({ 
            error,
            componentStack,
            hasError: true,
        });
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

        const { 
            id, 
            children, 
            flowKey,
        } = this.props;

        const modelChildren = manywho.model.getChildren(id, flowKey);

        return <div className="clearfix" id="vertical">
            {children || manywho.component.getChildComponents(modelChildren, id, flowKey)}
        </div>;
    }
}

manywho.component.registerContainer(registeredComponents.VERTICAL, Vertical);
manywho.styling.registerContainer('vertical_flow', (item, container) => {
    const classes = [];

    if (manywho.utils.isEqual(item.componentType, 'input', true)
            && item.size === 0 &&
            (
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.string, true,
                ) ||
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.password, true,
                ) ||
                manywho.utils.isEqual(
                    item.contentType, manywho.component.contentTypes.number, true,
                )
            )
        ) {
        classes.push('auto-width');

    }

    return classes;
});

export const getVertical = () : typeof Vertical => manywho.component.getByName(registeredComponents.VERTICAL);

export default Vertical;
