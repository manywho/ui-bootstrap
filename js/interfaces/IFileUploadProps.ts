import IComponentProps from './IComponentProps';

interface IFileUploadProps extends IComponentProps {
    flowKey: string;
    multiple: boolean;
    id?: string;
    isDesignTime?: boolean;
    upload?: Function;
    uploadCaption?: string;
    isChildComponent?: boolean;
    uploadComplete?: Function;
    smallInputs?: boolean;
    isUploadVisible?: boolean;
}

export default IFileUploadProps;
