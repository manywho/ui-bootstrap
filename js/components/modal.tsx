import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IModalProps from '../interfaces/IModalProps';
import { getNotifications } from './notifications';
import { getWait } from './wait';

import '../../css/modal.less';

class Modal extends React.Component<IModalProps, null> {
    
    constructor(props) {
        super(props);

        this.onEnter = this.onEnter.bind(this);
    }

    onEnter = manywho.component.mixins.enterKeyHandler.onEnter;

    renderModal() {

        const children = manywho.model.getChildren('root', this.props.flowKey);
        const outcomes = manywho.model.getOutcomes('root', this.props.flowKey);
        const state = manywho.state.getComponent(
            manywho.utils.extractElement(this.props.flowKey), 
            this.props.flowKey,
        ) || {};

        const Notifications = getNotifications();
        const Wait = getWait();

        if (
            state && state.loading == null && 
            !manywho.utils.isEqual(
                manywho.model.getInvokeType(this.props.flowKey), 
                'sync',
                true,
            )
        ) {
            manywho.component.focusInput(this.props.flowKey);
        }

        return (
            <div className={'modal show'}>
                <div className={'modal-dialog'} onKeyUp={this.onEnter}>
                    <div className={'modal-content'}>
                        <div className={'modal-header'}>
                            <h4 className={'modal-title'}>
                            {
                                manywho.model.getLabel(this.props.flowKey)
                            }
                            </h4>
                        </div>
                        <div className={'modal-body'}>
                            {
                                manywho.component.getChildComponents(
                                    children, 
                                    this.props.id, 
                                    this.props.flowKey,
                                )
                            }
                        </div>
                        <div className={'modal-footer'}>
                            {
                                manywho.component.getOutcomes(outcomes, this.props.flowKey)
                            }
                        </div>
                        <Notifications flowKey={this.props.flowKey} position={'left'} />
                        <Notifications flowKey={this.props.flowKey} position={'center'} />
                        <Notifications flowKey={this.props.flowKey} position={'right'} />
                        <Wait isVisible={state.loading} message={state.loading && state.loading.message} />
                    </div>
                </div>
            </div>
        );
    }

    renderBackdrop(modal) {

        return (
            <div>
                <div className={'modal-backdrop full-height'} />
                {modal}
            </div>
        );
    }

    render () {

        manywho.log.info('Rendering Modal');

        if (this.props.container) {

            this.props.container.classList.remove('hidden');

        }

        return this.renderBackdrop(this.renderModal());

    }

}

manywho.component.register(registeredComponents.MODAL, Modal, ['modal-standalone']);

export const getModal = () : typeof Modal => manywho.component.getByName(registeredComponents.MODAL);

export default Modal;
