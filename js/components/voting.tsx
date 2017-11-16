/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {
    
    /* tslint:disable-next-line:variable-name */
    class Voting extends React.Component<any, any> {

        render() {

            const isVisible = manywho.utils.isEqual(
                manywho.model.getInvokeType(this.props.flowKey),
                'waiting_on_votes',
                true,
            );
        
            if (isVisible) {
                manywho.log.info('Rendering Voting');
                return(
                    <div className="voting">
                        <span className= "glyphicon glyphicon-refresh status-icon spin"
                        aria-hidden= "true"></span>
                        <p className="lead">Waiting on votes</p>
                    </div>
                );

            }
            return null;
        }
    }


    manywho.component.register('voting', Voting);

}(manywho));
