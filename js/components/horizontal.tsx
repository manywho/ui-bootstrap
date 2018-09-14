import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import { getErrorFallback } from './error-fallback';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

class Horizontal extends React.Component<IComponentProps> {

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

        const childData = manywho.model.getChildren(id, flowKey);

        return <div className="row clearfix" id="horizontal">
            {children || manywho.component.getChildComponents(childData, id, flowKey)}
        </div>;
    }
}

manywho.component.registerContainer(registeredComponents.HORIZONTAL, Horizontal);

manywho.styling.registerContainer('horizontal_flow', (item, container) => {
    const columnSpan = Math.floor(12 / Math.max(1, container.childCount));
    return ['col-sm-' + columnSpan];
});

export const getHorizontal = () : typeof Horizontal => manywho.component.getByName(registeredComponents.HORIZONTAL);

export default Horizontal;
