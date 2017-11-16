/// <reference path="../interfaces/IReturnToParentProps.ts" />

(function (manywho) {
    
    /* tslint:disable-next-line:variable-name */
    const ReturnToParent: React.SFC<IReturnToParentProps> = ({ flowKey, parentStateId }) => {

        const onClick = () => {

            manywho.engine.returnToParent(flowKey, parentStateId);
        };

        if (!manywho.utils.isNullOrWhitespace(parentStateId)) {

            manywho.log.info('Rendering Return To Parent');

            return (
                <button className={'btn btn-info navbar-btn return-to-parent'} onClick={onClick}>
                { 
                    manywho.settings.global('localization.returnToParent', flowKey) 
                }
                </button>
            );
        }

        return null;
    };

    manywho.component.register('returnToParent', ReturnToParent);

}(manywho));
