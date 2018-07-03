import * as React from 'react';
import { findDOMNode } from 'react-dom';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import '../../css/flip.less';

declare var manywho: any;

interface IFlipState {
    isFlipped: boolean;
    animationStyle?: string;
}

// Stolen From: http://davidwalsh.name/css-flip
class Flip extends React.Component<IComponentProps, IFlipState> {

    constructor(props) {
        super(props);

        this.state = {
            isFlipped: false,
            animationStyle: 'rotateY',
        };

        this.toggleFlip = this.toggleFlip.bind(this);
        this.setHeight = this.setHeight.bind(this);
    }

    toggleFlip() {
        this.setState({ isFlipped: !this.state.isFlipped });
    }

    setHeight() {
        if (this.props.isDesignTime)
            return;

        const element = findDOMNode(this) as HTMLElement;

        if (this.state.isFlipped) {
            const back = findDOMNode(this.refs['back']).firstChild as HTMLElement;
            element.style.setProperty('height', back.offsetHeight + 'px');
        } else {
            const front = findDOMNode(this.refs['front']).firstChild as HTMLElement;
            element.style.setProperty('height', front.offsetHeight + 'px');
        }
    }

    componentDidUpdate() {
        this.setHeight();
    }

    componentDidMount() {
        this.setHeight();
    }

    render() {
        if (this.props.isDesignTime)
            return <div className="clearfix"></div>;

        const children = manywho.model.getChildren(this.props.id, this.props.flowKey);
        const childComponents =
            manywho.component.getChildComponents(children, this.props.id, this.props.flowKey);

        let className = 'flip-container clearfix';

        if (this.state.isFlipped)
            className += ' ' + this.state.animationStyle;

        return <div className={className}>
            <div className="flipper" onTouchEnd={this.toggleFlip} onClick={this.toggleFlip}>
                <div className="front" ref="front">
                    {childComponents[0]}
                </div>
                <div className="back" ref="back">
                    {childComponents[1]}
                </div>
            </div>
        </div>;
    }

}

manywho.component.registerContainer(registeredComponents.FLIP, Flip);

export const getFlip = () : typeof Flip => manywho.component.getByName(registeredComponents.FLIP);

export default Flip;
