import * as React from 'react';
import IModalContainerProps from '../interfaces/IModalContainerProps';

import '../../css/modal.less';

declare var manywho: any;

class ModalContainer extends React.Component<IModalContainerProps, null> {

    onKeyUp = (e) => {
        if (e.keyCode === 27)
            manywho.model.setModal(this.props.flowKey, null);
    }

    onClickBackdrop = (e) => {
        manywho.model.setModal(this.props.flowKey, null);
    }

    render() {
        let header = null;
        let footer = null;

        if (!manywho.utils.isNullOrEmpty(this.props.title))
            header = <div className="modal-header">
                <div className="modal-title">{this.props.title}</div>
            </div>;

        if (this.props.onConfirm || this.props.onCancel)
            footer = <div className="modal-footer">
                {
                    this.props.onCancel ? 
                    <button className="btn btn-default" onClick={this.props.onCancel}>
                        {this.props.cancelLabel || 'Cancel'}
                    </button> : 
                    null
                }
                {
                    this.props.onConfirm ? 
                    <button className="btn btn-primary" onClick={this.props.onConfirm}>
                        {this.props.confirmLabel || 'OK'}
                    </button> : 
                    null
                }                    
            </div>;

        return <div onKeyUp={this.onKeyUp}>
            <div className="modal-backdrop full-height" onClick={this.onClickBackdrop} />
            <div className="modal show">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {header}
                        <div className="modal-body">
                            {this.props.content}
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        </div>;
    }
}

manywho.component.modalContainer = ModalContainer;

export default ModalContainer;
