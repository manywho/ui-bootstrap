/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

// Stolen From: http://davidwalsh.name/css-flip
(function (manywho) {

    const flip = React.createClass({

        toggleFlip: function () {
            this.setState({ isFlipped: !this.state.isFlipped });
        },

        setHeight() {
            const element = ReactDOM.findDOMNode(this) as HTMLElement;

            if (this.state.isFlipped) {
                const back = ReactDOM.findDOMNode(this.refs['back']).firstChild as HTMLElement;
                element.style.setProperty('height', back.offsetHeight + 'px');
            }
            else {
                const front = ReactDOM.findDOMNode(this.refs['front']).firstChild as HTMLElement;
                element.style.setProperty('height', front.offsetHeight + 'px');
            }
        },

        getInitialState: function () {
            return {
                isFlipped: false,
                animationStyle: 'rotateY'
            };
        },

        componentDidUpdate: function () {
            this.setHeight();
        },

        componentDidMount: function () {
            this.setHeight();
        },

        render: function () {
            if (this.props.isDesignTime)
                return <div className="clearfix"></div>;

            const model = manywho.model.getContainer(this.props.id, this.props.flowKey);
            const children = manywho.model.getChildren(this.props.id, this.props.flowKey);
            const childComponents = manywho.component.getChildComponents(children, this.props.id, this.props.flowKey);

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

    });

    manywho.component.registerContainer('flip', flip);

} (manywho));
