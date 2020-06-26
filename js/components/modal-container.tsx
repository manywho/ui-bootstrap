import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IModalContainerProps from '../interfaces/IModalContainerProps';

import '../../css/modal.less';

declare var manywho: any;

const ModalContainer: React.SFC<IModalContainerProps> = ({
    title,
    content,
    flowKey,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
}) => {

    const onKeyUp = (e) => {
        if (e.keyCode === 27)
            manywho.model.setModal(flowKey, null);
    }

    // This is not desired behaviour and will be removed
    const onClickBackdrop = (e) => {
        manywho.model.setModal(flowKey, null);
    }

    let header = null;
    let footer = null;

    if (!manywho.utils.isNullOrEmpty(title)) {
        header = (
            <div className="modal-header">
                <div className="modal-title">{title}</div>
            </div>
        );
    }

    if (onConfirm || onCancel) {
        footer = (
            <div className="modal-footer">
                {
                    onCancel ? 
                    <button className="btn btn-default" onClick={onCancel}>
                        {cancelLabel || 'Cancel'}
                    </button> : 
                    null
                }
                {
                    onConfirm ? 
                    <button className="btn btn-primary" onClick={onConfirm}>
                        {confirmLabel || 'OK'}
                    </button> : 
                    null
                }                    
            </div>
        );
    }

    return (
        <div onKeyUp={onKeyUp}>
            <div className="modal-backdrop full-height" onClick={onClickBackdrop} />
            <div className="modal show">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {header}
                        <div className="modal-body">
                            {content}
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Do not remove this as it is a public global and may be relied upon
// Do not access this component via this property
// Use the exported getModalContainer function
manywho.component.modalContainer = ModalContainer;

manywho.component.register(registeredComponents.MODAL_CONTAINER, ModalContainer);
export const getModalContainer = () : typeof ModalContainer => manywho.component.getByName(registeredComponents.MODAL_CONTAINER) || ModalContainer;

export default ModalContainer;