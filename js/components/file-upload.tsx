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
        upload: (flowKey, _, onProgress, files, request) => {
            const tenantId = manywho.utils.extractTenantId(flowKey);
            const authenticationToken = manywho.state.getAuthenticationToken(flowKey);
            const stateId = manywho.utils.extractStateId(flowKey);

            return manywho.ajax.uploadFiles(files, request, tenantId, authenticationToken, onProgress, stateId);
        },
    };

    uploadComplete(response, id, flowKey) {
        if (
            response && 
            !manywho.utils.isNullOrWhitespace(id)
        ) {
            const objectData = response.objectData.map((item) => {
                item.isSelected = true;
                return item;
            });

            manywho.state.setComponent(
                id, { objectData }, flowKey, true,
            );

            manywho.component.handleEvent(
                this, 
                manywho.model.getComponent(id, flowKey), 
                flowKey,
            );
        }
    }

    render() {
        const model = 
            !manywho.utils.isNullOrWhitespace(this.props.id) && 
            manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering File Upload: ${this.props.id}`);

        let outcomes = null;

        if (!this.props.isChildComponent && this.props.id) {
            outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        }

        const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME); 

        const outcomeButtons = outcomes && outcomes.map(outcome => <Outcome id={outcome.id} key={outcome.id} flowKey={this.props.flowKey} />);

        manywho.log.info(`Rendering File Upload: ${this.props.id}`);

        return (
            <React.Fragment>
                <FileUpload
                    id={this.props.id}
                    multiple={manywho.utils.isNullOrUndefined(this.props.multiple) ? model.isMultiSelect : this.props.multiple}
                    upload={(files, progress) => Promise.resolve(this.props.upload(
                        this.props.flowKey, 
                        null, // this param (FileData) kept for backwards compatibility
                        progress, 
                        files, 
                        model && model.fileDataRequest
                            ? model.fileDataRequest
                            : null,
                    ))}
                    uploadCaption={this.props.uploadCaption}
                    uploadComplete={response => this.uploadComplete(response, this.props.id, this.props.flowKey)}
                    smallInputs={this.props.smallInputs}
                    isUploadVisible={this.props.isUploadVisible}
                    isAutoUpload={model.attributes && model.attributes.isAutoUpload ? model.attributes.isAutoUpload.toLowerCase() === 'true' : false}
                    label={model.label}
                    isRequired={model.isRequired}
                    validationMessage={model.validationMessage}
                    isVisible={model.isVisible}
                    isValid={model.isValid}
                    hintValue={model.hintValue === ''
                        ? manywho.settings.global('localization.fileUploadMessage', this.props.flowKey)
                        : model.hintValue}
                    helpInfo={model.helpInfo}
                    disabled={this.props.isDesignTime}
                />
                {outcomeButtons}
            </React.Fragment>
        );
    }

}

manywho.component.register(registeredComponents.FILE_UPLOAD, FileUploadWrapper, ['file_upload']);

export const getFileUpload = () : typeof FileUploadWrapper => manywho.component.getByName(registeredComponents.FILE_UPLOAD);

export default FileUploadWrapper;
