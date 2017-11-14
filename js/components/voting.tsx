/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {
    
    /* tslint:disable-next-line:variable-name */
    const Voting: React.SFC<IComponentProps> = ({ id, parentId, flowKey }) => {

        const isVisible = manywho.utils.isEqual(
            manywho.model.getInvokeType(flowKey),
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

        } else {
            return null;
        }

    };

    manywho.component.register('voting', Voting);

}(manywho));
