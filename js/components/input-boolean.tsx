/// <reference path="../../typings/index.d.ts" />
/// <reference path="../interfaces/IInputProps.ts" />

declare var manywho: any;
declare var moment: any;

interface IInputBooleanState {
    value: string
}

class InputBoolean extends React.Component<IInputProps, IInputBooleanState> {

    constructor(props: IInputProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(e.target.checked);
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const checked = (typeof this.props.value === 'string' && manywho.utils.isEqual(this.props.value, 'true', true)) || this.props.value === true;

        return <div className="checkbox">
            <label>
                <input id={this.props.id}
                    checked={checked}
                    type="checkbox"
                    disabled={this.props.disabled || this.props.readOnly}
                    required={this.props.required}
                    onChange={!this.props.isDesignTime && this.onChange} />
                {model.label}
                {model.isRequired ? <span className="input-required"> *</span> : null}
            </label>
        </div>;
    }

}

manywho.component.register('input-boolean', InputBoolean);
