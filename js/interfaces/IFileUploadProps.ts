import IComponentProps from './IComponentProps';

interface IFileUploadProps extends IComponentProps {
    multiple: boolean;
    upload?: Function;
    uploadCaption?: string;
    isChildComponent?: boolean;
    uploadComplete?: Function;
    smallInputs?: boolean;
    isUploadVisible?: boolean;
}

export default IFileUploadProps;
