import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

declare var manywho: any;

interface IInputBooleanProps extends IComponentProps {
    value: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    onChange: Function;
    autocomplete: any;
}

const InputBoolean: React.SFC<IInputBooleanProps> = (
    { id, parentId, flowKey, value, disabled, readOnly, isDesignTime, required, autocomplete, onChange },
) => {

    const model = manywho.model.getComponent(id, flowKey);
    const checked =
        typeof value === 'string' ?
            manywho.utils.isEqual(value, 'true', true) :
            value === true;

    const onInputChange = (e) => {
        onChange(e.target.checked);
    };

    return <div className="checkbox">
        <label>
            <input id={id}
                checked={checked}
                type="checkbox"
                disabled={disabled || readOnly}
                required={required}
                onChange={!isDesignTime && onInputChange}
                autoComplete={autocomplete} />
            {model.label}
            {model.isRequired ? <span className="input-required"> *</span> : null}
        </label>
    </div>;
};

manywho.component.register(registeredComponents.INPUT_BOOLEAN, InputBoolean);

export const getInputBoolean = () : typeof InputBoolean => manywho.component.getByName(registeredComponents.INPUT_BOOLEAN) || InputBoolean;

export default InputBoolean;
