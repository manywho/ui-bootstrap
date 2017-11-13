/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IComponentProps.ts" />

declare var manywho: any;

(function (manywho) {

    const status: React.SFC<IComponentProps> = ({ flowKey }) => {

        const isVisible: boolean = 
            manywho.utils
                .isEqual(manywho.model.getInvokeType(flowKey), 'wait', true)
            || manywho.utils
                .isEqual(manywho.model.getInvokeType(flowKey), 'status', true);

        if (isVisible) {
            manywho.log.info('Rendering Status');

            const message: string = 
                manywho.settings.global('localization.status', flowKey, null)
                || manywho.model.getWaitMessage(flowKey) || '';

            let content = <p className="lead status-message status-content">{message}</p>;

            if (message.indexOf('<') !== -1 && message.indexOf('>') !== -1)
                content = 
                    <div className="status-content" 
                        dangerouslySetInnerHTML={{ __html: message }}/>;

            return (
                <div className="status">
                    <div className="wait-spinner"></div>
                    {content}
                </div>
            );

        } else
            return null;
            
    };

    manywho.component.register('status', status);

} (manywho));
