import IWaitProps from '../interfaces/IWaitProps';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import registeredComponents from '../constants/registeredComponents';

declare var manywho: any;

class Wait extends React.Component<IWaitProps, null> {

    componentDidUpdate() {
        if (findDOMNode(this.refs['wait'])) {
            const element = findDOMNode(this.refs['wait']);
            if (element.clientHeight > window.innerHeight) {
                (element.children[0] as HTMLElement)
                    .style.top = 'calc(40% + ' + window.scrollY + ')';
            }
        }
    }

    render() {
        if (this.props.isVisible) {

            manywho.log.info('Rendering Wait');

            const spinnerClassNames = ['wait-spinner'];

            if (this.props.isSmall) {
                spinnerClassNames.push('wait-spinner-small');
            }

            return (
                <div className="wait-container" ref="wait">
                    <div className={spinnerClassNames.join(' ')}></div>
                    <span className="wait-message">{this.props.message}</span>
                </div>
            );

        }

        return null;
    }
}

manywho.component.register(registeredComponents.WAIT, Wait);

export const getWait = () : typeof Wait => manywho.component.getByName(registeredComponents.WAIT) || Wait;

export default Wait;
