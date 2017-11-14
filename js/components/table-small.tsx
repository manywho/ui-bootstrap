/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function(manywho){

    class tableSmall extends React.Component<any, any> {
        constructor(props) {
            super(props);
        }

        renderOutcomeColumn = (item, model, outcomes) => {
            const outcomeComponent = manywho.component.getByName('outcome');
            return(<tr>
                <th className="table-small-column table-small-label">
                    Actions
                </th>
                <td className="table-small-column"
                    data-item={item.externalId}
                    data-model={model.id}>
                        {outcomes.map(function (outcome) {
                            return React.createElement(
                                outcomeComponent,
                                {id: outcome.id,
                                    onClick: this.onOutcomeClick,
                                    flowKey: this.props.flowKey},
                                null,
                            );
                        })}
                </td>
            </tr>)
        }

        renderRows = (objectData, outcomes, displayColumns) => {
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            return objectData.map(function (item) {

                const classNames = ['list-group-item', 'clearfix'];
                const isSelected = this.props.selectedRows.filter((row) => {
                     return manywho.utils.isEqual(
                         item.externalId,
                         row.externalId,
                         true,
                    );
                }).length > 0;

                if (isSelected) {
                    classNames.push('active');
                }

                const attributes = {
                    className: classNames.join(' '),
                    id: item.externalId,
                    'data-item': item.externalId,
                    onClick: null,
                };

                const isOutcomeDestructive = outcomes.filter((outcome) => {
                    return manywho.utils.isEqual(outcome.pageActionBindingType, 'remove', true)
                        || manywho.utils.isEqual(outcome.pageActionBindingType, 'delete', true);
                }).length > 0;

                let chevron = null;

                if (outcomes.length === 1 && !isOutcomeDestructive) {

                    attributes['data-outcome'] = outcomes[0].id;
                    attributes.onClick = this.onItemClick;
                    chevron = <span
                        className = "glyphicon glyphicon-chevron-right table-small-chevron">
                    </span>;

                }

                if (outcomes.length !== 1) {
                    attributes.onClick = this.props.onRowClicked;
                }

                return(
                    <li {...attributes}>
                        <table className = "table table-small-item">
                            <tbody>
                                {displayColumns.map((column) => {
                                    if (column === 'mw-outcomes') {
                                        if (outcomes.length > 1 || isOutcomeDestructive) {
                                            this.renderOutcomeColumn(item, model, outcomes)
                                        }
                                    } else {
                                        let selectedProperty = item.properties.filter(
                                            (property) => {
                                                return property.typeElementPropertyId ===
                                                column.typeElementPropertyId;
                                            })[0];

                                        
                                        if (!manywho.utils.isNullOrWhitespace(
                                            column.typeElementPropertyToDisplayId)) {
                                            if (selectedProperty != null &&
                                                selectedProperty.objectData != null) {
                                                selectedProperty = selectedProperty.objectData[0].properties.filter(
                                                    (childProperty) => {
                                                    return childProperty.typeElementPropertyId == column.typeElementPropertyToDisplayId;
                                                })[0];
                                            }
                                        }

                                        if (selectedProperty) {
                                            
                                            var element = React.DOM.span(null, manywho.formatting.format(selectedProperty.contentValue, selectedProperty.contentFormat, selectedProperty.contentType, this.props.flowKey));
        
                                            if (this.props.isFiles &&
                                                (manywho.utils.isEqual(selectedProperty.typeElementPropertyId, manywho.settings.global('files.downloadUriPropertyId'), true)
                                                || manywho.utils.isEqual(selectedProperty.developerName, manywho.settings.global('files.downloadUriPropertyName'), true))) {
        
                                                element = React.DOM.a({ href: selectedProperty.contentValue, className: 'btn btn-info', target: '_blank' }, 'Download');
        
                                            }
        
                                            return React.DOM.tr(null, [
                                                React.DOM.th({ className: 'table-small-column table-small-label' }, column.label),
                                                React.DOM.td({ className: 'table-small-column' }, element)
                                            ]);
        
                                        }

                                    }
                                })}
                            </tbody>
                        </table>
                    </li>
                )

                return React.DOM.li(attributes, [
                    React.DOM.table(
                        { className: 'table table-small-item' },
                        React.DOM.tbody(
                            null,
                            displayColumns.map(function (column) {

                            if (column == 'mw-outcomes') {

                                if (outcomes.length > 1 || isOutcomeDestructive) {

                                    return React.DOM.tr(null, [
                                        React.DOM.th({ className: 'table-small-column table-small-label' }, 'Actions'),
                                        React.DOM.td({ className: 'table-small-column', 'data-item': item.externalId, 'data-model': model.id }, outcomes.map(function (outcome) {

                                            return React.createElement(outcomeComponent, { id: outcome.id, onClick: this.onOutcomeClick, flowKey: this.props.flowKey }, null);

                                        }, this))
                                    ]);

                                }

                            }
                            else {

                                var selectedProperty = item.properties.filter(function (property) {

                                    return property.typeElementPropertyId == column.typeElementPropertyId;

                                })[0];

                                if (!manywho.utils.isNullOrWhitespace(column.typeElementPropertyToDisplayId)) {

                                    if (selectedProperty != null && selectedProperty.objectData != null) {

                                        selectedProperty = selectedProperty.objectData[0].properties.filter(function (childProperty) {

                                            return childProperty.typeElementPropertyId == column.typeElementPropertyToDisplayId;

                                        })[0];

                                    }

                                }

                                if (selectedProperty) {

                                    var element = React.DOM.span(null, manywho.formatting.format(selectedProperty.contentValue, selectedProperty.contentFormat, selectedProperty.contentType, this.props.flowKey));

                                    if (this.props.isFiles &&
                                        (manywho.utils.isEqual(selectedProperty.typeElementPropertyId, manywho.settings.global('files.downloadUriPropertyId'), true)
                                        || manywho.utils.isEqual(selectedProperty.developerName, manywho.settings.global('files.downloadUriPropertyName'), true))) {

                                        element = React.DOM.a({ href: selectedProperty.contentValue, className: 'btn btn-info', target: '_blank' }, 'Download');

                                    }

                                    return React.DOM.tr(null, [
                                        React.DOM.th({ className: 'table-small-column table-small-label' }, column.label),
                                        React.DOM.td({ className: 'table-small-column' }, element)
                                    ]);

                                }

                            }

                        }, this)
                        )
                    ),
                    chevron
                ]);

            }, this);
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
                this.props.displayColumns
            );

            return <ul className={classNames}>
                {items}
            </ul>;
        }
    }

    manywho.component.register('mw-table-small', tableSmall);

}(manywho));
