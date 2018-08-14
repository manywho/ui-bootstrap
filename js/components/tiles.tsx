import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import ITilesProps from '../interfaces/ITilesProps';
import { getOutcome } from './outcome';
import { getItemsHeader } from './items-header';
import { getWait } from './wait';
import { Motion, spring } from 'react-motion';
import { getTileItem } from './tile-item';

import '../../css/tiles.less';

declare var manywho: any;

class Tiles extends React.Component<ITilesProps, null> {

    constructor(props: ITilesProps) {
        super(props);
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

    render() {
        manywho.log.info('Rendering Tiles: ' + this.props.id);

        if (this.props.isDesignTime)
            return null;

        const Outcome = getOutcome();
        const ItemsHeader = getItemsHeader();
        const Wait = getWait();
        const TileItem = getTileItem();

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
                key={outcome.id}
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
                                <Motion defaultStyle={{ rotate: 0 }}
                            style={{ rotate: spring(
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
                                        <TileItem 
                                            flowKey={this.props.flowKey}
                                            item={item} 
                                            columns={columns} 
                                            outcomes={footerOutcomes} 
                                            deleteOutcome={deleteOutcome}
                                            onNext = {this.onNext}
                                            onPrev = {this.onPrev}
                                            onOutcome = {this.onOutcome}
                                            onSelect = {this.onSelect}
                                        />
                                    </div>
                                </div>);
                            } }
                        </Motion>
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
