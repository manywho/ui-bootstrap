import IComponentProps from './IComponentProps';

interface IFileUploadProps extends IComponentProps {
    upload: Function;
    multiple: boolean;
    uploadCaption?: string;
    isChildComponent?: boolean;
    uploadComplete?: Function;
    smallInputs?: boolean;
    isUploadVisible?: boolean;
}

export default IFileUploadProps;
