interface ITableInputProps extends IComponentProps {
    contentType: string;
    contentFormat: string;
    propertyId: string;
    onCommitted: Function;
    value: any;
}
