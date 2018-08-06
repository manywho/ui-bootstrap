import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import ITileItemProps from '../interfaces/ITileItemProps';
import { getOutcome } from './outcome';

import '../../css/outcome.less';

declare var manywho: any;

class TileItem extends React.PureComponent<ITileItemProps, null> {

    render() {

        const { 
            flowKey,
            item, 
            columns, 
            outcomes, 
            deleteOutcome, 
            onNext,
            onPrev,
            onOutcome,
            onSelect, 
        } = this.props;

        manywho.log.info('Rendering Tile Item: ' + item.externalId);

        const Outcome = getOutcome();

        if (item.type === 'next')
            return <div className="mw-tiles-next"
                onClick={onNext}>
                <span className="glyphicon glyphicon-arrow-right" />
            </div>;

        if (item.type === 'prev')
            return <div className="mw-tiles-prev"
                onClick={onPrev}>
                <span className="glyphicon glyphicon-arrow-left" />
            </div>;

        let className = 'mw-tiles-item';
        if (item.isSelected)
            className += ' bg-info';

        const selectedProperty = item.properties.find(
            property => property.typeElementPropertyId === columns[0].typeElementPropertyId,
        );
        const header: string = manywho.formatting.format(
            selectedProperty.contentValue,
            selectedProperty.contentFormat,
            selectedProperty.contentType,
            flowKey,
        );

        let deleteOutcomeElement = null;
        if (deleteOutcome)
            deleteOutcomeElement = 
                <Outcome 
                    id={deleteOutcome.id}
                    flowKey={flowKey}
                    onClick={onOutcome}
                    size={'sm'}
                />;

        let content: string = null;
        if (columns.length > 1) {
            const selectedProperty = item.properties.find(
                property => property.typeElementPropertyId === columns[1].typeElementPropertyId,
            );
            content = manywho.formatting.format(
                selectedProperty.contentValue,
                selectedProperty.contentFormat,
                selectedProperty.contentType,
                flowKey,
            );
        }

        let footer: (JSX.Element)[] = null;
        if (columns.length > 2)
            footer = columns.map((column, index) => {
                if (index > 1) {
                    const selectedProperty = item.properties.find(
                        property => property.typeElementPropertyId === column.typeElementPropertyId,
                    );
                    const content = manywho.formatting.format(
                        selectedProperty.contentValue,
                        selectedProperty.contentFormat,
                        selectedProperty.contentType,
                        flowKey,
                    );
                    return <li key={selectedProperty.developerName}><strong>{selectedProperty.developerName}</strong>: {content}</li>;
                }
            })
            .filter(column => !!column);

        return (<div className={className} onClick={onSelect} id={item.externalId}>
            <div className="mw-tiles-item-header">
                <h4 title={header}>{header}</h4>
                {deleteOutcomeElement}
            </div>
            <div className="mw-tiles-item-content">{content}</div>
            <ul className="mw-tiles-item-footer list-unstyled">{footer}</ul>
            <div className="mw-tiles-item-outcomes">{outcomes}</div>
        </div>);
    }
}

manywho.component.register(registeredComponents.TILE_ITEM, TileItem);

export const getTileItem = () : typeof TileItem => manywho.component.getByName(registeredComponents.TILE_ITEM) || TileItem;

export default TileItem;
