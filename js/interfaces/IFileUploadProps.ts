import IComponentProps from './IComponentProps';

interface IFileUploadProps extends IComponentProps {
    flowKey: string;
    multiple: boolean;
    id?: string;
    isDesignTime?: boolean;
    upload?: (flowKey: string, formData: FormData, onProgress: ({ lengthComputable, loaded, total }) => void, files: File[], fileDataRequest: any) => Promise<any>;
    uploadCaption?: string;
    isChildComponent?: boolean;
    uploadComplete?: Function;
    smallInputs?: boolean;
    isUploadVisible?: boolean;
}

export default IFileUploadProps;
