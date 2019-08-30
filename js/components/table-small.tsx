import * as React from 'react';
import * as $ from 'jquery';
import registeredComponents from '../constants/registeredComponents';
import ITableSmallProps from '../interfaces/ITableSmallProps';
import { getOutcome } from './outcome';
import { checkRowIsSelected } from './utils/TableUtils';

import '../../css/table.less';

declare const manywho: any;

class TableSmall extends React.Component<ITableSmallProps, null> {

    componentDidMount() {
        this.centerChevrons();
    }

    componentDidUpdate() {
        this.centerChevrons();
    }

    onOutcomeClick = (e, outcome) => {
        const objectDataId = $(e.target).closest('[data-item]').attr('data-item');
        this.props.onOutcome(objectDataId, outcome.id);
    }

    onItemClick = (e) => {  
        if (this.props.isDesignTime) {
            return;
        }

        e.preventDefault();

        const objectDataId = e.currentTarget.getAttribute('data-item');
        const outcomeId = e.currentTarget.getAttribute('data-outcome');
        this.props.onOutcome(objectDataId, outcomeId);
    }

    centerChevrons() {
        
        const chevrons = document.querySelectorAll('.table-small-chevron');

        for (let i = 0; i < chevrons.length; i += 1) {
            const $chevron = $(chevrons[i]);
            const parentHeight = $chevron.parent().height();
            $chevron.css('margin-top', `${((parentHeight / 2) - ($chevron.height() / 2))}px`);
        }
    }

    renderOutcomeColumn = (item, model, outcomes) => {
        const Outcome = getOutcome();

        return (
            <tr key={item.internalId}>
                <th className="table-small-column table-small-label">
                    Actions
                </th>
                <td 
                    className="table-small-column"
                    data-item={item.internalId}
                    data-model={model.id}
                >
                    {
                        outcomes.map(
                            outcome => <Outcome key={outcome.id} id={outcome.id} onClick={this.onOutcomeClick} flowKey={this.props.flowKey} />,
                        )
                    }
                </td>
            </tr>
        );
    }

    renderRows = (objectData, outcomes, displayColumns) => {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        return objectData.map((item) => {

            const classNames = ['list-group-item', 'clearfix'];
            const isSelected = this.props.selectedRows.filter(row => checkRowIsSelected(row, item)).length > 0;

            if (isSelected) {
                classNames.push('active');
            }

            const attributes = {
                className: classNames.join(' '),
                id: item.internalId,
                'data-item': item.internalId,
                onClick: null,
            };

            const isOutcomeDestructive = outcomes.filter(
                outcome => manywho.utils.isEqual(outcome.pageActionBindingType, 'remove', true) ||
                    manywho.utils.isEqual(outcome.pageActionBindingType, 'delete', true),
            ).length > 0;

            let chevron = null;

            if (outcomes.length === 1 && !isOutcomeDestructive) {

                attributes['data-outcome'] = outcomes[0].id;
                attributes.onClick = this.onItemClick;
                chevron = <span className="glyphicon glyphicon-chevron-right table-small-chevron" />;
            }

            if (outcomes.length !== 1) {
                attributes.onClick = this.props.onRowClicked;
            }

            return (
                <li {...attributes} key={item.internalId}>
                    <table className="table table-small-item">
                        <tbody>
                            {displayColumns.map((column) => {
                                if (column === 'mw-outcomes') {
                                    if (outcomes.length > 1 || isOutcomeDestructive) {
                                        return this.renderOutcomeColumn(item, model, outcomes);
                                    }
                                } else {
                                    let selectedProperty = item.properties.filter(
                                        property => property.typeElementPropertyId === column.typeElementPropertyId,
                                    )[0];

                                    if (!manywho.utils.isNullOrWhitespace(column.typeElementPropertyToDisplayId)) {
                                        if (selectedProperty != null &&
                                            selectedProperty.objectData != null) {
                                            selectedProperty = selectedProperty.objectData[0].properties.filter(
                                                (childProperty) => {
                                                    return childProperty.typeElementPropertyId === column.typeElementPropertyToDisplayId;
                                                })[0];
                                        }
                                    }

                                    if (selectedProperty) {
                                        
                                        let element = (
                                            <span>
                                                {manywho.formatting.format(
                                                    selectedProperty.contentValue,
                                                    selectedProperty.contentFormat,
                                                    selectedProperty.contentType,
                                                    this.props.flowKey,
                                                )}
                                            </span>
                                        );
    
                                        if (this.props.isFiles &&
                                            (manywho.utils.isEqual(
                                                selectedProperty.typeElementPropertyId,
                                                manywho.settings.global(
                                                    'files.downloadUriPropertyId',
                                                ),
                                                true,
                                            )
                                            || manywho.utils.isEqual(
                                                selectedProperty.developerName,
                                                manywho.settings.global(
                                                    'files.downloadUriPropertyName',
                                                ),
                                                true,
                                            ))
                                        ) {
                                            element = (
                                                <a 
                                                    href={selectedProperty.contentValue}
                                                    className="btn btn-info"
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                >
                                                    Download
                                                </a>
                                            );        
                                        }

                                        return (
                                            <tr key={selectedProperty.developerName}>
                                                <th className="table-small-column table-small-label">
                                                    {column.label}
                                                </th>
                                                <td className="table-small-column">{element}</td>
                                            </tr>
                                        );
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    {chevron}
                </li>
            );
        });
    }

    render() {
        manywho.log.info('Rendering Table-Small');
        
        const classNames = [
            'list-group',
            (this.props.isValid) ? '' : 'table-invalid',
        ].join(' ');

        const items = this.renderRows(
            this.props.objectData || [],
            this.props.outcomes,
            this.props.displayColumns,
        );

        return (
            <ul className={classNames}>
                {items}
            </ul>
        );
    }
}

manywho.component.register(registeredComponents.TABLE_SMALL, TableSmall);

export const getTableSmall = () : typeof TableSmall => manywho.component.getByName(registeredComponents.TABLE_SMALL);

export default TableSmall;
