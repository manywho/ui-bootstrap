import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import ITableLargeProps from '../interfaces/ITableLargeProps';
import { getTableInput } from './table-input';
import { getOutcome } from './outcome';
import { checkRowIsSelected } from './utils/TableUtils';

// tslint:disable-next-line
import Dynamic from './dynamic';

import '../../css/table.less';

declare const manywho: any;

const selectAllRef = React.createRef();

/* eslint-disable import/prefer-default-export */
class TableLarge extends React.Component<ITableLargeProps, null> {

    componentDidUpdate() {
        const selectAll: HTMLInputElement = 
            selectAllRef.current as HTMLInputElement;

        if (selectAll) {
            selectAll.indeterminate = 
                (this.props.selectedRows.length > 0 && 
                    this.props.selectedRows.length !== this.props.totalObjectData);
        }
    }

    setPropertyValue(objectData, id, propertyId, value) {
        return objectData.map((item) => {
            item.properties = item.properties.map((prop) => {
                if (manywho.utils.isEqual(prop.typeElementPropertyId, propertyId, true)
                    && manywho.utils.isEqual(item.internalId, id, true)) {
                    if (Array.isArray(value)) {
                        prop.objectData = value;
                    } else {
                        prop.contentValue = value;
                    }
                }
                return prop;
            });
            return item;
        });
    }

    onOutcomeClick = (e, outcome) => {
        const objectDataId = e.currentTarget.parentElement.getAttribute('data-item');
        this.props.onOutcome(objectDataId, outcome.id);
    }

    onCellEditCommitted = (id, propertyId, value) => {
        const objectData = this.setPropertyValue(this.props.objectData, id, propertyId, value);
        manywho.state.setComponent(
            this.props.id, 
            { objectData }, 
            this.props.flowKey, 
            false,
        );
    }

    isTableEditable(columns) {
        return columns.filter(column => column.isEditable).length > 0;
    }

    renderHeaderRow(displayColumns) {

        let columns = [];

        if (this.props.model.isMultiSelect && this.props.objectData) {

            const checkboxProps = {
                type: 'checkbox',
                onChange: this.props.selectAll,
                ref: selectAllRef,
                checked: this.props.selectedRows.length === this.props.totalObjectData,
            };

            columns.push(<th className="checkbox-cell" key="checkbox"><input {...checkboxProps} /></th>);

        } else if (manywho.utils.isEqual(this.props.model.attributes.radio, 'true', true)) {
            columns.push(<th key="radio" />);
        }

        columns = columns.concat(displayColumns.map((column) => {

            if (column === 'mw-outcomes') {
                return <th className="table-outcome-column" key="actions">Actions</th>;
            }

            const headerProps = {
                id: column.typeElementPropertyId,
                'data-sort-property': column.developerName,
                key: `header-${column.typeElementPropertyId}`,
                onClick: (this.props.onHeaderClick) ? this.props.onHeaderClick : null,
            };

            const headerChildren = [column.label];

            if (
                manywho.utils.isEqual(
                    this.props.sortedBy, column.typeElementPropertyId, true,
                )
            ) {

                let iconClassName = 'table-header-icon glyphicon ';
                iconClassName += 
                    this.props.sortedIsAscending ? 
                        'glyphicon-menu-down' : 
                        'glyphicon-menu-up';

                headerChildren.push(<span className={iconClassName} />);
            }

            return <th key={column.typeElementPropertyId} {...headerProps}>{headerChildren}</th>;
            
        }));

        return <tr key="header-row">{columns}</tr>;
    }

    renderRows(
        flowKey, objectData, outcomes, displayColumns, selectedRows, 
        onRowClicked, onSelect, outcomeDisplay,
    ) {            
        const Outcome = getOutcome();
        const TableInput = getTableInput();

        return objectData.map((item) => {
            const isSelected = selectedRows.filter(row => checkRowIsSelected(row, item)).length > 0;

            const className = (isSelected) ? 'info' : null;

            let columns = [];

            if (this.props.model.isMultiSelect) {
                columns.push(
                    <td className="checkbox-cell" key="checkbox-cell">
                        <input 
                            id={item.internalId} 
                            type="checkbox" 
                            checked={isSelected} 
                            onClick={onSelect}
                        />
                    </td>,
                );

            } else if (manywho.utils.isEqual(this.props.model.attributes.radio, 'true', true)) {
                columns.push(
                    <td className="checkbox-cell" key="checkbox-cell">
                        <input
                            id={item.internalId} 
                            type="radio" 
                            checked={isSelected} 
                            onClick={onSelect}
                        />
                    </td>,
                );
            }

            columns = columns.concat(displayColumns.map((column) => {
                if (column === 'mw-outcomes') {
                    return (
                        <td 
                            className="table-outcome-column" 
                            key={item.internalId + column} 
                            data-item={item.internalId}
                        >
                            {
                                outcomes.map(
                                    outcome => (
                                        <Outcome 
                                            flowKey={flowKey}
                                            id={outcome.id}
                                            key={outcome.id} 
                                            onClick={this.onOutcomeClick}
                                            display={outcomeDisplay.outcomes}
                                        />
                                    ),
                                )
                            }
                        </td>
                    );
                }
                    
                let selectedProperty = item.properties.find(property => property.typeElementPropertyId === column.typeElementPropertyId);

                if (
                    !manywho.utils.isNullOrWhitespace(column.typeElementPropertyToDisplayId)
                ) {

                    if (
                        selectedProperty !== null && 
                        selectedProperty.objectData !== null && 
                        selectedProperty.objectData.length
                    ) {
                        selectedProperty = 
                            selectedProperty.objectData[0].properties
                                .find(childProperty => childProperty.typeElementPropertyId === column.typeElementPropertyToDisplayId);
                    }
                }

                if (selectedProperty) {

                    if (
                        this.props.isFiles &&
                        (manywho.utils.isEqual(
                            selectedProperty.typeElementPropertyId, 
                            manywho.settings.global('files.downloadUriPropertyId'), 
                            true,
                        ) || 
                            manywho.utils.isEqual(
                                selectedProperty.developerName, 
                                manywho.settings.global('files.downloadUriPropertyName'), 
                                true,
                            )
                        )
                    ) {

                        const props: any = { 
                            href: selectedProperty.contentValue, 
                            target: '_blank',
                        };

                        const buttonClasses = ['btn', 'btn-sm'];

                        if (
                            manywho.utils.isNullOrWhitespace(selectedProperty.contentValue)
                        ) {
                            buttonClasses.push('btn-default');
                            props.disabled = 'disabled';
                        } else {
                            buttonClasses.push('btn-info');
                        }

                        props.className = buttonClasses.join(' ');

                        return <td key="download"><a {...props}>Download</a></td>;

                    } 
                    
                    if (!manywho.utils.isNullOrWhitespace(column.componentType)) {

                        const columnProps = {
                            id: item.internalId,
                            propertyId: column.typeElementPropertyId,
                            contentValue: selectedProperty.contentValue,
                            objectData: selectedProperty.objectData,
                            onCommitted: this.onCellEditCommitted,
                            flowKey: this.props.flowKey,
                            isEditable: column.isEditable,
                            contentType: column.contentType,
                            contentFormat: column.contentFormat,
                        };

                        return (
                            <td 
                                id={column.typeElementPropertyId} 
                                key={column.typeElementPropertyId}
                            >
                                <Dynamic name={column.componentType} props={columnProps} />
                            </td>
                        );

                    }
                    
                    if (column.isEditable) {
                        return (
                            <td 
                                id={column.typeElementPropertyId} 
                                key={column.typeElementPropertyId} 
                                className="editable"
                            >
                                {
                                    <TableInput
                                        id={item.internalId}
                                        propertyId={column.typeElementPropertyId}
                                        value={selectedProperty.contentValue}
                                        contentType={column.contentType}
                                        contentFormat={column.contentFormat}
                                        onCommitted={this.onCellEditCommitted}
                                        flowKey={this.props.flowKey}
                                    />
                                }
                            </td>
                        );

                    }

                    const contentValue = manywho.formatting.format(
                        selectedProperty.contentValue, 
                        selectedProperty.contentFormat, 
                        selectedProperty.contentType, 
                        flowKey,
                    );

                    return (
                        <td 
                            id={column.typeElementPropertyId} 
                            key={column.typeElementPropertyId}
                        >
                            <span>{contentValue}</span>
                        </td>
                    );                        
                }

                return <td key={column.typeElementPropertyId} />;                    
            }));

            // The row key cannot be the objects external id, as if flow is 
            // offline the external id does not necessarily exist
            return (
                <tr 
                    className={className} 
                    id={item.internalId} 
                    key={item.internalId}
                    onClick={onRowClicked}
                >
                    {columns}
                </tr>
            );
        });
    }

    render() {
        manywho.log.info('Rendering Table-Large');

        const isValid = 
            (this.props.model.isValid !== undefined) ? 
                this.props.model.isValid : 
                this.props.isDesignTime && true;

        const tableClassName = [
            'table',
            (this.props.model.attributes.borderless && 
                manywho.utils.isEqual(this.props.model.attributes.borderless, 'true', true)) ? 
                '' : 
                'table-bordered',
            (this.props.model.attributes.striped && 
                manywho.utils.isEqual(this.props.model.attributes.striped, 'true', true)) ? 
                'table-striped' : 
                '',
            (this.props.isSelectionEnabled) ? 'table-hover' : '',
            (isValid) ? '' : 'table-invalid',
        ].join(' ');

        let rows = [this.renderHeaderRow(this.props.displayColumns)];
        rows = rows.concat(
            this.renderRows(
                this.props.flowKey, 
                this.props.objectData || [], 
                this.props.outcomes, 
                this.props.displayColumns, 
                this.props.selectedRows, 
                this.props.onRowClicked, 
                this.props.onSelect, 
                this.props.model.attributes,
            ),
        );

        return (
            <div className="table-responsive">
                <table className={tableClassName}>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }

}

manywho.component.register(registeredComponents.TABLE_LARGE, TableLarge);

export const getTableLarge = () : typeof TableLarge => manywho.component.getByName(registeredComponents.TABLE_LARGE);

export default TableLarge;
