import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import { getErrorFallback } from './error-fallback';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

class Inline extends React.Component<IComponentProps> {

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

        return <div className="clearfix">
            {
                children ||
                manywho.component.getChildComponents(childData, id, flowKey)
            }
        </div>;
    }
}

manywho.component.registerContainer(registeredComponents.INLINE, Inline);

manywho.styling.registerContainer('inline_flow', () => ['pull-left']);

export const getInline = () : typeof Inline => manywho.component.getByName(registeredComponents.INLINE) || Inline;

export default Inline;
