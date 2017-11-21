import IFileUploadProps from '../interfaces/IFileUploadProps';
import '../../css/files.less';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IFileUploadState {
    isUploadDisabled?: boolean;
    isFileSelected?: boolean;
    isProgressVisible?: boolean;
    isUploadComplete?: boolean;
    fileNames?: string[];
    progress?: number;
    error?: any;
    files?: any;
}

(function (manywho) {

    class FileUpload extends React.Component<IFileUploadProps, IFileUploadState> {

        static defaultProps = {
            uploadCaption: 'Upload',
            browseCaption: 'Browse',
            smallInputs: false,
            isUploadVisible: true,
            uploadComplete: null,
            upload: (flowKey, formData, onProgress) => {
                const tenantId = manywho.utils.extractTenantId(flowKey);
                const authenticationToken = manywho.state.getAuthenticationToken(flowKey);

                return manywho.ajax.uploadFile(formData, tenantId, authenticationToken, onProgress);
            },
        };

        constructor(props) {
            super(props);

            this.state = {
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

                const formData = new FormData();
                Array.prototype.slice.call(this.state.files).forEach((file) => {
                    formData.append('FileData', file);
                });

                const model = 
                    !manywho.utils.isNullOrWhitespace(this.props.id) ? 
                    manywho.model.getComponent(this.props.id, this.props.flowKey) : 
                    false;

                if (model && model.fileDataRequest)
                    formData.append('FileDataRequest', JSON.stringify(model.fileDataRequest));

                return this.props.upload(this.props.flowKey, formData, (e: any) => {
                    if (e.lengthComputable)
                        this.setState({ 
                            progress: parseInt((e.loaded / e.total * 100).toString(), 10),
                        });
                })
                .done((response) => {
                    this.setState({
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

                    (ReactDOM.findDOMNode(this.refs.upload) as HTMLInputElement).value = '';

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
                    this.setState({
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
                componentClassName += ' has-error';
                validationMessage = <span className="help-block">{this.state.error}</span>;
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

            const outcomeButtons = outcomes && outcomes.map(outcome => 
                React.createElement(
                    manywho.component.getByName('outcome'), 
                    { id: outcome.id, flowKey: this.props.flowKey },
                ),
            );

            return <div className={componentClassName} id={this.props.id}>
                <div className="clearfix">
                    {label}
                    <Dropzone {...dropzoneProps}>
                        <div>Drop files here, or click to select files</div>
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
                {helpInfo}
                {outcomeButtons}
            </div>;
        }

    }

    manywho.component.register('file-upload', FileUpload, ['file_upload']);

}(manywho));
