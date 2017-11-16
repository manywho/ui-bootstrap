interface IFileUploadProps extends IComponentProps {
    upload: Function;
    multiple: boolean;
    uploadCaption: string;
    isChildComponent?: boolean;
    uploadComplete?: Function;
    smallInputs?: boolean;
    isUploadVisible?: boolean;
}
