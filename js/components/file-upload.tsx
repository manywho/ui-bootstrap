import * as React from 'react';
import { findDOMNode } from 'react-dom';
// tslint:disable-next-line
import Dropzone from 'react-dropzone';
import registeredComponents from '../constants/registeredComponents';
import IFileUploadProps from '../interfaces/IFileUploadProps';
import outcome from './outcome';
import '../../css/files.less';

interface IFileStatus {
    fileName: string;
    uploadSuccessful: boolean;
}

interface IFileUploadState {
    fileStatusList?: IFileStatus[];
    isUploadDisabled?: boolean;
    isFileSelected?: boolean;
    isProgressVisible?: boolean;
    isUploadComplete?: boolean;
    fileNames?: string[];
    progress?: number;
    error?: any;
    files?: any;
}

class FileUpload extends React.Component<IFileUploadProps, IFileUploadState> {

    static defaultProps = {
        uploadCaption: 'Upload',
        browseCaption: 'Browse',
        smallInputs: false,
        isUploadVisible: true,
        uploadComplete: null,
        upload: (flowKey, _, onProgress, files, request) => {
            const tenantId = manywho.utils.extractTenantId(flowKey);
            const authenticationToken = manywho.state.getAuthenticationToken(flowKey);
            const stateId = manywho.utils.extractStateId(flowKey);

            return manywho.ajax.uploadFiles(files, request, tenantId, authenticationToken, onProgress, stateId);
        },
    };

    constructor(props) {
        super(props);

        this.state = {
            fileStatusList: [],
            isUploadDisabled: false,
            isFileSelected: false,
            isProgressVisible: false,
            isUploadComplete: false,
            fileNames: [],
            error: null,
        };
    }

    onUpload = () => {
        if (this.state.fileNames.length > 0) {
            this.setState({
                isUploadDisabled: true,
                isProgressVisible: true,
                progress: 0,
                error: null,
            });

            const files = [...this.state.files];

            const model = 
                !manywho.utils.isNullOrWhitespace(this.props.id) ? 
                manywho.model.getComponent(this.props.id, this.props.flowKey) : 
                false;

            const request = model && model.fileDataRequest
                ? model.fileDataRequest
                : null;

            // Second param (FileData) kept for backwards compatibility
            return this.props.upload(
                this.props.flowKey, 
                null, 
                ({ lengthComputable, loaded, total }) => {
                    if (lengthComputable) {
                        this.setState({ 
                            progress: parseInt((loaded / total * 100).toString(), 10),
                        });
                    }
                }, 
                files, 
                request,
            )
            .done((response) => {

                const newFileStatuses: IFileStatus[] = this.state.fileNames.map(
                    fileName => ({ fileName, uploadSuccessful: true }),
                );

                const appendedFileStatusList = [...this.state.fileStatusList, ...newFileStatuses];

                this.setState({
                    fileStatusList: appendedFileStatusList,
                    isUploadDisabled: false,
                    isFileSelected: false,
                    isUploadComplete: true,
                    fileNames: [],
                    error: null,
                });

                setTimeout(
                    () => {
                        this.setState({ 
                            isUploadComplete: false, isProgressVisible: false, progress: 100,
                        });
                    }, 
                    2000,
                );

                (findDOMNode(this.refs.upload) as HTMLInputElement).value = '';

                if (this.props.uploadComplete) {
                    this.props.uploadComplete(response);
                } else if (
                    !this.props.uploadComplete && response && 
                    !manywho.utils.isNullOrWhitespace(this.props.id)
                ) {
                    const objectData = response.objectData.map((item) => {
                        item.isSelected = true;
                        return item;
                    });

                    manywho.state.setComponent(
                        this.props.id, { objectData }, this.props.flowKey, true,
                    );

                    manywho.component.handleEvent(
                        this, 
                        manywho.model.getComponent(this.props.id, this.props.flowKey), 
                        this.props.flowKey,
                    );
                }
            })
            .fail((response) => {

                const newFileStatuses: IFileStatus[] = this.state.fileNames.map(
                    fileName => ({ fileName, uploadSuccessful: false }),
                );

                const appendedFileStatusList = [...this.state.fileStatusList, ...newFileStatuses];

                this.setState({
                    fileStatusList: appendedFileStatusList,
                    isUploadDisabled: false,
                    isProgressVisible: false,
                    progress: 0,
                    error: response.statusText,
                });
            });
        }
    }

    onDrop = (files) => {
        if (!this.props.isDesignTime)
            this.onFileSelected(files);
    }

    onFileSelected = (files) => {
        if (!this.props.isDesignTime) {
            this.setState({
                files,
                fileNames: Array.prototype.slice.call(files).map(file => file.name),
                isFileSelected: true,
            });

            const model = 
                !manywho.utils.isNullOrWhitespace(this.props.id) && 
                manywho.model.getComponent(this.props.id, this.props.flowKey);

            if (model && model.attributes && model.attributes.isAutoUpload)
                setTimeout(this.onUpload.bind(this));
        }
    }

    render() {
        const model = 
            !manywho.utils.isNullOrWhitespace(this.props.id) && 
            manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering File Upload: ${this.props.id}`);

        let outcomes = null;

        if (!this.props.isChildComponent && this.props.id)
            outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const progress = (this.state.progress || 0) + '%';

        let label = null;
        let helpInfo = null;
        let validationMessage = null;
        let isAutoUpload = false;
        let uploadClassName = 'btn btn-primary';
        let inputClassName = 'form-control filenames';
        let progressClassName = 'progress-bar';
        let componentClassName = 'file-upload';

        if (this.props.smallInputs) {
            uploadClassName += ' btn-sm';
            inputClassName += ' input-sm';
        }

        if (!this.props.isUploadVisible)
            uploadClassName += ' hidden';

        if (this.state.isUploadComplete)
            progressClassName += ' progress-bar-success';

        if (model) {
            const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

            isAutoUpload = model.attributes && model.attributes.isAutoUpload;

            label = 
                <label>
                    {model.label}
                    {
                        model.isRequired ? 
                            <span className="input-required"> *</span> : 
                            null
                    }
                </label>;

            validationMessage = 
                <span className="help-block">
                {
                    model.validationMessage || state.validationMessage
                }
            </span>;

            helpInfo = <span className="help-block">{model.helpInfo}</span>;

            if (model.isVisible === false)
                componentClassName += ' hidden';

            if (model.isValid === false || state.isValid === false)
                componentClassName += ' has-error';
        }

        if (this.state.error) {
            validationMessage = <span className="has-error"><span className="help-block">{this.state.error}</span></span>;
        }

        const dropzoneProps: any = {
            ref: 'upload',
            multiple: manywho.utils.isNullOrUndefined(this.props.multiple) ? 
                model.isMultiSelect : 
                this.props.multiple,
            className: 'dropzone',
        };

        const buttonProps: any = {
            className: uploadClassName,
            disabled: 
                this.state.isUploadDisabled || 
                !this.state.isFileSelected || 
                this.props.isDesignTime,
        };

        if (!this.props.isDesignTime) {
            dropzoneProps.onDrop = this.onDrop;
            buttonProps.onClick = this.onUpload;
        }

        const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME); 

        const outcomeButtons = outcomes && outcomes.map(outcome => 
            <Outcome id={outcome.id} flowKey={this.props.flowKey} />,
        );

        const hintMessage = model.hintValue === ''
            ? manywho.settings.global('localization.fileUploadMessage', this.props.flowKey)
            : model.hintValue;

        return <div className={componentClassName} id={this.props.id}>
            <div className="clearfix">
                {label}
                <Dropzone {...dropzoneProps}>
                    <div>{ hintMessage }</div>
                </Dropzone>
                <div className={'input-group ' + ((isAutoUpload) ? 'hidden' : '')}>
                    <input type="text" 
                        className={inputClassName} 
                        readOnly={true} 
                        value={this.state.fileNames.join(' ')} />
                    <span className="input-group-btn">
                        <button {...buttonProps}>{this.props.uploadCaption}</button>
                    </span>
                </div>
            </div>
            <div className={
                'progress files-progress ' + ((this.state.isProgressVisible) ? '' : 'hidden')
                }>
                <div className={progressClassName} style={{ width: progress }} />
            </div>
            {validationMessage}
            <ul className="file-statuses">
                {
                    this.state.fileStatusList.map((fileStatus, index) => (
                        <li key={index} className={fileStatus.uploadSuccessful ? 'has-success' : 'has-error'}>
                            <span className="help-block">
                                <span className={`glyphicon glyphicon-${fileStatus.uploadSuccessful ? 'ok' : 'remove'}`}>
                                </span>
                                    { fileStatus.fileName }
                                </span>
                        </li>
                    ))
                }
            </ul>
            {helpInfo}
            {outcomeButtons}
        </div>;
    }

}

manywho.component.register(registeredComponents.FILE_UPLOAD, FileUpload, ['file_upload']);

export const getFileUpload = () : typeof FileUpload => manywho.component.getByName(registeredComponents.FILE_UPLOAD);

export default FileUpload;
