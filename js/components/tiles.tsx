import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import ITilesProps from '../interfaces/ITilesProps';
import { getOutcome } from './outcome';
import { getItemsHeader } from './items-header';
import { getWait } from './wait';

import '../../css/tiles.less';

declare var manywho: any;
declare var ReactMotion: any;

class Tiles extends React.Component<ITilesProps, null> {

    constructor(props: ITilesProps) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }

    onSelect = (e) => {
        this.props.select(e.currentTarget.id);
    }

    onOutcome = (e) => {
        this.props.onOutcome(e.currentTarget.parentElement.parentElement.id, e.currentTarget.id);
    }

    onPrev = () => {
        this.props.onPrev();
        setTimeout(() => (this.refs['container'] as HTMLElement).scrollIntoView(true));
    }

    onNext = () => {
        this.props.onNext();
        setTimeout(() => (this.refs['container'] as HTMLElement).scrollIntoView(true));
    }

    onSearch = (search: string, clearSelection: boolean) => {
        this.props.onSearch(search, clearSelection);
    }

    renderItem (
        item: any,
        columns: (any)[],
        outcomes: (any)[],
        deleteOutcome: any,
    ): JSX.Element {

        const Outcome = getOutcome();

        if (item.type === 'next')
            return <div className="mw-tiles-next"
                onClick={this.onNext}>
                <span className="glyphicon glyphicon-arrow-right" />
            </div>;

        if (item.type === 'prev')
            return <div className="mw-tiles-prev"
                onClick={this.onPrev}>
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
            this.props.flowKey,
        );

        let deleteOutcomeElement = null;
        if (deleteOutcome)
            deleteOutcomeElement = 
                <Outcome 
                    id={deleteOutcome.id}
                    flowKey={this.props.flowKey}
                    onClick={this.onOutcome}
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
                this.props.flowKey,
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
                        this.props.flowKey,
                    );
                    return <li><strong>{selectedProperty.developerName}</strong>: {content}</li>;
                }
            })
            .filter(column => !!column);

        return (<div className={className} onClick={this.onSelect} id={item.externalId}>
            <div className="mw-tiles-item-header">
                <h4 title={header}>{header}</h4>
                {deleteOutcomeElement}
            </div>
            <div className="mw-tiles-item-content">{content}</div>
            <ul className="mw-tiles-item-footer list-unstyled">{footer}</ul>
            <div className="mw-tiles-item-outcomes">{outcomes}</div>
        </div>);
    }

    render() {
        manywho.log.info('Rendering Tiles: ' + this.props.id);

        if (this.props.isDesignTime)
            return null;

        const Outcome = getOutcome();
        const ItemsHeader = getItemsHeader();
        const Wait = getWait();

        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const state = this.props.isDesignTime ? { error: null, loading: false } :
            manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        const outcomes: any = manywho.model.getOutcomes(this.props.id, this.props.flowKey);
        const columns: (any)[] = manywho.component.getDisplayColumns(model.columns) || [];

        let className = manywho.styling.getClasses(
            this.props.parentId,
            this.props.id,
            'tiles',
            this.props.flowKey,
        ).join(' ');

        if (model.isVisible === false)
            className += ' hidden';

        let labelElement = null;
        if (!manywho.utils.isNullOrWhitespace(model.label))
            labelElement = <label>{model.label}</label>;

        let isDisabled = false;
        if (model.isEnabled === false || this.props.isLoading)
            isDisabled = true;

        const headerProps = {
            isDisabled,
            flowKey: this.props.flowKey,
            isSearchable: model.isSearchable,
            isRefreshable: (model.objectDataRequest || model.fileDataRequest),
            onSearch: this.onSearch,
            outcomes: manywho.model.getOutcomes(this.props.id, this.props.flowKey),
            refresh: this.props.refresh,
        };

        const headerElement = <ItemsHeader {...headerProps} />;

        const footerOutcomes: object[] = outcomes && outcomes
        .filter(outcome => !manywho.utils.isEqual(
            outcome.pageActionType,
            'Delete', 
            true) && !outcome.isBulkAction)
        .map(
            outcome => <Outcome
                id={outcome.id}
                flowKey={this.props.flowKey}
                onClick={this.onOutcome}
                size={'default'}
            />,
        );

        const deleteOutcome: any = outcomes && outcomes
            .filter(outcome => manywho.utils.isEqual(
                outcome.pageActionType,
                'Delete',
                true,
            ) && !outcome.isBulkAction)[0];

        let contentElement = null;
        let items = [];

        if (this.props.objectData && !manywho.utils.isPlaceholderObjectData(
            this.props.objectData,
        )) {
            items = this.props.objectData.map(item => item);

            if (this.props.page > 1)
                items.unshift({ type: 'prev' });

            if (this.props.hasMoreResults === true)
                items = items.concat([{ type: 'next' }]);
        }

        if (this.props.contentElement)
            contentElement = this.props.contentElement;
        else
            contentElement = (<div className="mw-tiles-items">
                {items.map((item, index) => {
                    const key: string = `${this.props.page.toString()}-${index}`;

                    return (<div className="mw-tiles-item-container" key={key} ref="items">
                        <ReactMotion.Motion defaultStyle={{ rotate: 0 }}
                            style={{ rotate: ReactMotion.spring(
                                180,
                                { stiffness: 65, damping: 9.5 },
                            ) }}>

                            {(interpolatingStyle) => {
                                const frontTransform: string = `rotateY(
                                    ${interpolatingStyle.rotate}deg
                                )`;
                                const backTransform: string = `rotateY(
                                    ${180 - interpolatingStyle.rotate}deg
                                )`;

                                return (<div>
                                    <div className="front"
                                        style={{ transform: frontTransform }}>
                                    </div>
                                    <div className="back"
                                        style={{ transform: backTransform }}>
                                        {this.renderItem(
                                            item, columns, footerOutcomes, deleteOutcome,
                                        )}
                                    </div>
                                </div>);
                            } }
                        </ReactMotion.Motion>
                    </div>);
                })}
            </div>);


        return (
            <div className={className} id={this.props.id} ref="container">
                {labelElement}
                {headerElement}
                {contentElement}
                <Wait isVisible={state.loading} message={state.loading && state.loading.message} />
            </div>
        );
    }
}

manywho.component.registerItems(registeredComponents.TILES, Tiles);

export const getTiles = () : typeof Tiles => manywho.component.getByName(registeredComponents.TILES);

export default Tiles;
