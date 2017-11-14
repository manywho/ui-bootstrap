(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Radio: React.SFC<any> = ({ id, flowKey, isDesignTime, parentId }) => {

        manywho.log.info('Rendering Radio Buttons: ' + id);

        const renderOption = (item, attributes, column, developerName, selectedItems, flowKey) => {

            const optionAttributes : any = {};

            if (item.properties) {

                const label = item.properties.filter((value) => {

                    return manywho.utils.isEqual(value.typeElementPropertyId, column, true);
                })[0];

                const type = attributes.multiSelect ? 'checkbox' : 'radio';

                manywho.utils.extend(
                    optionAttributes, 
                    [
                        attributes, 
                        { 
                            type, 
                            name: developerName, 
                            value: item.externalId,
                        },
                    ],
                );

                if (attributes.multiSelect) {

                    const isSelected = selectedItems.filter((selectedItem) => {
                        return item.externalId === selectedItem;
                    }).length > 0;

                    optionAttributes.checked = isSelected ? 'checked' : '';

                } else {

                    if (attributes.value === item.externalId) {

                        optionAttributes.checked = 'checked';
                    }
                }

                return (
                    <div className={type}>
                        <input {...optionAttributes} />
                        {
                            manywho.formatting.format(
                                label.contentValue, 
                                label.contentFormat, 
                                label.contentType, 
                                flowKey,
                            )
                        }
                    </div>
                );
            }

            return null;
        };

        const isEmptyObjectData = (model) => {

            if (model.objectDataRequest && model.objectData && model.objectData.length === 1) {

                for (const prop in model.objectData[0].properties) {

                    if (
                        !manywho.utils.isNullOrWhitespace(
                            model.objectData[0].properties[prop].contentValue,
                        )
                    ) {
                        return false;
                    }
                }

            } else if (model.objectData) {

                return false;
            }

            return true;
        };

        const handleChange = (e) => {

            const model = manywho.model.getComponent(id, flowKey);
            const state = manywho.state.getComponent(id, flowKey);

            let selectedObjectData = null;

            if (!manywho.utils.isEmptyObjectData(model)) {

                if (state && state.objectData) {

                    selectedObjectData = state.objectData.filter(item => item.isSelected);

                } else {

                    selectedObjectData = model.objectData.filter(item => item.isSelected);
                }
            }

            model.objectData = model.objectData.map((item) => {

                item.isSelected = false;
                return item;
            });

            if (model.isMultiSelect) {

                selectedObjectData = selectedObjectData.filter((object) => {

                    return object.externalId !== e.target.value;
                });

                if (e.target.checked) {

                    selectedObjectData.push(model.objectData.filter((item) => {

                        return e.target.value === item.externalId;
                    })[0]);

                }

            } else {

                selectedObjectData = model.objectData.filter((item) => {

                    return e.target.value === item.externalId;
                });

            }

            selectedObjectData = selectedObjectData.map((item) => {

                item.isSelected = true;
                return item;
            });

            manywho.state.setComponent(
                id, 
                { objectData: selectedObjectData }, 
                flowKey, 
                true,
            );

            manywho.component.handleEvent(this, model, flowKey);
        };

        let options = [];

        const model = manywho.model.getComponent(id, flowKey);
        const state = 
            isDesignTime ? 
            { error: null, loading: false } : 
            manywho.state.getComponent(id, flowKey) || {};

        const outcomes = manywho.model.getOutcomes(id, flowKey);

        const attributes : any = {
            required: model.isRequired && 'required',
            disabled: (!model.isEnabled || !model.isEditable) && 'disabled',
            multiSelect: model.isMultiSelect,
        };

        if (!isDesignTime) {

            const columnTypeElementPropertyId = 
                manywho.component.getDisplayColumns(model.columns)[0].typeElementPropertyId;

            manywho.utils.extend(attributes, { onClick: this.handleChange });

            if (!isEmptyObjectData(model)) {

                let selectedItems = null;

                if (state && state.objectData) {

                    selectedItems = state.objectData.map(item => item.externalId);
                } else {

                    selectedItems = 
                        model.objectData
                        .filter(item => item.isSelected)
                        .map(item => item.externalId);
                }

                if (selectedItems && !model.isMultiSelect) {

                    attributes.value = selectedItems[0];
                }

                options = model.objectData.map((item) => {
                    return renderOption(
                        item, 
                        attributes, 
                        columnTypeElementPropertyId, 
                        model.developerName, 
                        selectedItems, 
                        flowKey,
                    );
                });
            }
        } else {

            const type = attributes.multiSelect ? 'checkbox' : 'radio';
            options = [];

            for (let i = 1; i < 4; i += 1) {
                options.push((
                    <label className={type}>
                        <input type={type} />
                        { 'Radio ' + i }
                    </label>
                ));
            }
        }

        let containerClassNames = ['form-group'];

        if (model.isValid === false || state.isValid === false || state.error)
            containerClassNames.push('has-error');

        if (model.isVisible === false)
            containerClassNames.push('hidden');

        containerClassNames = containerClassNames.concat(
            manywho.styling.getClasses(
                parentId,
                id, 
                'radio', 
                flowKey,
            ),
        );

        const iconClassNames = ['select-loading-icon'];

        if (!state.loading || state.error)
            iconClassNames.push('hidden');

        const outcomeButtons = outcomes && outcomes.map((outcome) => {
            return React.createElement(
                manywho.component.getByName('outcome'), 
                { flowKey, id: outcome.id },
            );
        });

        return (
            <div className={containerClassNames.join(' ')} id={id}>
                <label for={ id }>
                    {model.label}
                    { 
                        model.isRequired ? 
                        <span className={'input-required'}> *</span> : 
                        null
                    }
                </label>
                <div className={'radio-group'}>
                    options
                </div>
                <div className={iconClassNames.join(' ')}>
                    <span className={'glyphicon glyphicon-refresh spin'} />
                </div>
                <span className={'help-block'}>
                {
                    (state.error && state.error.message) || 
                    model.validationMessage || 
                    state.validationMessage
                }
                </span>
                <span className={'help-block'}>{model.helpInfo}</span>
                {outcomeButtons}
            </div>
        );
    };

    manywho.component.register('radio', Radio);

})(manywho);
