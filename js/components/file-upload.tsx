import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IFileUploadProps from '../interfaces/IFileUploadProps';
import outcome from './outcome';
import '../../css/files.less';
import FileUpload from '@boomi/react-file-upload';

export function uploadComplete(component, response, id, flowKey) {
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
            component, 
            manywho.model.getComponent(id, flowKey), 
            flowKey,
        );
    }
}

const FileUploadWrapper: React.SFC<IFileUploadProps> = (props) => {

    const model = 
        !manywho.utils.isNullOrWhitespace(props.id) && 
        manywho.model.getComponent(props.id, props.flowKey);

    manywho.log.info(`Rendering File Upload: ${props.id}`);

    let outcomes = null;

    if (!props.isChildComponent && props.id) {
        outcomes = manywho.model.getOutcomes(props.id, props.flowKey);
    }

    const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME); 

    const outcomeButtons = outcomes && outcomes.map(outcome => <Outcome id={outcome.id} key={outcome.id} flowKey={props.flowKey} />);

    manywho.log.info(`Rendering File Upload: ${props.id}`);

    return (
        <React.Fragment>
            <FileUpload
                id={props.id}
                multiple={manywho.utils.isNullOrUndefined(props.multiple) ? model.isMultiSelect : props.multiple}
                upload={(files, progress) => Promise.resolve(props.upload(
                    props.flowKey, 
                    null, // this param (FileData) kept for backwards compatibility
                    progress, 
                    files, 
                    model && model.fileDataRequest
                        ? model.fileDataRequest
                        : null,
                ))}
                uploadCaption={props.uploadCaption}
                uploadComplete={response => uploadComplete(this, response, props.id, props.flowKey)}
                smallInputs={props.smallInputs}
                isUploadVisible={props.isUploadVisible}
                isAutoUpload={model.attributes && model.attributes.isAutoUpload ? model.attributes.isAutoUpload.toLowerCase() === 'true' : false}
                label={model.label}
                isRequired={model.isRequired}
                validationMessage={model.validationMessage}
                isVisible={model.isVisible}
                isValid={model.isValid}
                hintValue={model.hintValue === ''
                    ? manywho.settings.global('localization.fileUploadMessage', props.flowKey)
                    : model.hintValue}
                helpInfo={model.helpInfo}
                disabled={props.isDesignTime}
            />
            {outcomeButtons}
        </React.Fragment>
    );
};

FileUploadWrapper.defaultProps = {
    uploadCaption: 'Upload',
    smallInputs: false,
    isUploadVisible: true,
    upload: (flowKey, _, onProgress, files, request) => {
        const tenantId = manywho.utils.extractTenantId(flowKey);
        const authenticationToken = manywho.state.getAuthenticationToken(flowKey);
        const stateId = manywho.utils.extractStateId(flowKey);

        return manywho.ajax.uploadFiles(files, request, tenantId, authenticationToken, onProgress, stateId);
    },
};

manywho.component.register(registeredComponents.FILE_UPLOAD, FileUploadWrapper, ['file_upload']);

export const getFileUpload = () : typeof FileUploadWrapper => manywho.component.getByName(registeredComponents.FILE_UPLOAD);

export default FileUploadWrapper;
