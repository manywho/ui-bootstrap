import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IFileUploadProps from '../interfaces/IFileUploadProps';
import outcome from './outcome';
import FileUpload from '@boomi/react-file-upload';
import { renderOutcomesInOrder } from './utils/CoreUtils';

import '../../css/files.less';

/**
 * This function handles the saving of data to state, engine and collaboration servers
 *
 * @param response Successful response from the file upload
 * @param id The identifier given to this component
 * @param flowKey
 * @param onComplete Function to be called from the parent component. This is for when the upload component
 * is listing files. The callback typically would be to fetch files to be displayed
 */
export function uploadComplete(response: {objectData}, id: string, flowKey: string, onComplete: Function) {
    if (
        response &&
        !manywho.utils.isNullOrWhitespace(id)
    ) {
        const objectData = response.objectData.map((item) => {
            item.isSelected = true;
            return item;
        });

        // Save the objectData from the response to the component state
        manywho.state.setComponent(
            id, { objectData }, flowKey, true,
        );

        // Re-sync with the server so that any events attached to the component are processed
        manywho.component.handleEvent(
            null, // This parameter is only used for forceUpdating, which we don't need
            manywho.model.getComponent(id, flowKey),
            flowKey,
        );

        if (onComplete) {
            onComplete();
        }
    }
}

/**
 * This is a file upload component that has a dropzone to accept files from a user's local machine,
 * and uploads them to the Service selected in the Flow
 *
 * This component is a wrapper for: [@boomi/react-file-upload](https://github.com/manywho/react-file-upload)
 *
 * @param props Setup configuration for the fileupload component e.g. props.multiple, props.smallInputs, props.isUploadVisible
 * @return File upload react component with props options configured and set
 */
const FileUploadWrapper: React.SFC<IFileUploadProps> = (props) => {

    const model =
        !manywho.utils.isNullOrWhitespace(props.id) &&
        manywho.model.getComponent(props.id, props.flowKey);
    // If client-side validation is enabled (IValidationResult), local state overrides the validity of the server-side model validation
    const state = { ...{ isValid: true, validationMessage: null }, ...manywho.state.getComponent(props.id, props.flowKey) };

    manywho.log.info(`Rendering File Upload: ${props.id}`);

    let outcomes = null;

    if (!props.isChildComponent && props.id) {
        outcomes = manywho.model.getOutcomes(props.id, props.flowKey);
    }

    const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME);

    const outcomeButtons = outcomes && outcomes.map(
        outcomeButton => <Outcome id={outcomeButton.id} key={outcomeButton.id} flowKey={props.flowKey} />,
    );

    manywho.log.info(`Rendering File Upload: ${props.id}`);

    const fileUploadComponent = (
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
            uploadComplete={response => uploadComplete(response, props.id, props.flowKey, props.uploadComplete)}
            smallInputs={props.smallInputs}
            isUploadVisible={props.isUploadVisible}
            isAutoUpload={model.attributes && model.attributes.isAutoUpload ? model.attributes.isAutoUpload.toLowerCase() === 'true' : false}
            label={model.label}
            isRequired={model.isRequired}
            validationMessage={state.validationMessage || model.validationMessage}
            isVisible={model.isVisible}
            isValid={state.isValid && model.isValid} // If client-side validation is disabled state.isValid is true. See IValidationResult.
            hintValue={model.hintValue === ''
                ? manywho.settings.global('localization.fileUploadMessage', props.flowKey)
                : model.hintValue}
            helpInfo={model.helpInfo}
            disabled={props.isDesignTime}
        />
    );

    return (
        <React.Fragment>
            {renderOutcomesInOrder(fileUploadComponent, outcomeButtons, outcomes, model.isVisible)}
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
