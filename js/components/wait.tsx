/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {
    
    function arePropsSpecified(props) { 
        if (Object.keys(props).length === 1) {
            return !props.hasOwnProperty('children');
        }
        return Object.keys(props).length > 0;  
    }

    class Wait extends React.Component<any, any> {
        
        constructor(props) {
            super(props);
        }

        componentDidUpdate() {    
            if (ReactDOM.findDOMNode(this.refs['wait'])) {
                const element = ReactDOM.findDOMNode(this.refs['wait']);
                if (element.clientHeight > window.innerHeight) {
                    (element.children[0] as HTMLElement)
                        .style.top = 'calc(40% + ' + window.scrollY + ')';
                }
            }
        }

        getDefaultProps() {          
            return {
                isVisible: false,
                isSmall: false,
                message: null,
            };
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

    manywho.component.register('wait', Wait);
    
}(manywho));
