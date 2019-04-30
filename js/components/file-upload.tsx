import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IFileUploadProps from '../interfaces/IFileUploadProps';
import outcome from './outcome';
import '../../css/files.less';
import FileUpload from '@boomi/react-file-upload';

class FileUploadWrapper extends React.Component<IFileUploadProps> {

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
    }

    render() {
        const model = 
            !manywho.utils.isNullOrWhitespace(this.props.id) && 
            manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering File Upload: ${this.props.id}`);

        let outcomes = null;

        if (!this.props.isChildComponent && this.props.id)
            outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        //connect ondrop and on upload to the dropzone

        const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME); 

        const outcomeButtons = outcomes && outcomes.map(outcome => 
            <Outcome id={outcome.id} flowKey={this.props.flowKey} />,
        );

        return <React.Fragment>
            <FileUpload
                multiple={manywho.utils.isNullOrUndefined(this.props.multiple) ? model.isMultiSelect : this.props.multiple}
                upload={ (files, progress) => this.props.upload(
                        this.props.flowKey, 
                        null, 
                        progress, 
                        files, 
                        model && model.fileDataRequest
                            ? model.fileDataRequest
                            : null,
                )}
                uploadCaption={this.props.uploadCaption}
                uploadComplete={this.props.uploadComplete}
                smallInputs={this.props.smallInputs}
                isUploadVisible={this.props.isUploadVisible}
                completedUpload={this.props.uploadComplete}
                getFileUploadMessage={manywho.settings.global('localization.fileUploadMessage')}
                loggingFunction={manywho.log.info}
                handleEvent={() => manywho.component.handleEvent(
                    this, 
                    manywho.model.getComponent(this.props.id, this.props.flowKey), 
                    this.props.flowKey,
                )}
                isAutoUpload={model.attributes ? model.attributes.isAutoUpload : false}
                label={model.label}
                isRequired={model.isRequired}
                validationMessage={model.validationMessage}
                isVisible={model.isVisible}
                isValid={model.isValid}
                hintValue={model.hintValue}
                helpInfo={model.helpInfo}
                disabled={this.props.isDesignTime}
            />
            {outcomeButtons}
        </React.Fragment>;
    }

}

manywho.component.register(registeredComponents.FILE_UPLOAD, FileUploadWrapper, ['file_upload']);

export const getFileUpload = () : typeof FileUploadWrapper => manywho.component.getByName(registeredComponents.FILE_UPLOAD);

export default FileUploadWrapper;
