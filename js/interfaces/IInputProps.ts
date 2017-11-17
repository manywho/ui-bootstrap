import IComponentProps from './IComponentProps';

interface IInputProps extends IComponentProps {
    value: string | boolean;
    placeholder: string;
    onChange: any;
    onBlur: any;
    required: boolean;
    disabled: boolean;
    readOnly: boolean;
    size: number;
    format: string;
    isDesignTime: boolean;
    autocomplete: string;
}

export default IInputProps;
