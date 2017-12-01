import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import '../../css/history.less';

class History extends React.Component<IComponentProps, null> {

    onClick(e) {

        manywho.model.popHistory(e.currentTarget.id, this.props.flowKey);

        manywho.engine.navigate(this.props.id, null, e.currentTarget.id, this.props.flowKey);

    }

    renderOutcome(outcome, selectedOutcome, outcomeWidth) {

        let classes = 'outcome-info alert ';
        if (outcome.id === selectedOutcome) classes += ' selected-outcome';

        return (
            <div className={classes} style={{ width: outcomeWidth }}>
                <p style={{ textAlign: 'center' }}>
                    {outcome.label}
                </p>
            </div>
        );
    }

    renderSteps(history) {

        return history.map((step, index) => {

            if (index < history.length - 1 && step.name) {

                const outcomes = step.outcomes || [];

                const outcomeWidth = Math.floor(100 / outcomes.length) - 2 + '%';

                return <div className={'history-row'}>
                    <div id={step.id} className={'step bg-primary'} onClick={this.onClick}>
                        <div className={'step-title'}>{step.label || step.name}</div>
                        <div className={'step-content'}
                            dangerouslySetInnerHTML={{ __html: step.content || '' }} />
                    </div>
                    {
                        outcomes.map(
                            function (outcome) {
                                return this.renderOutcome(
                                    outcome, step.selectedOutcome, outcomeWidth,
                                );
                            },
                            this,
                        )
                    }
                </div>;
            }
        });
    }

    render() {

        if (
            manywho.settings.global('history', this.props.flowKey) &&
            !manywho.settings.isDebugEnabled(this.props.flowKey)
        ) {

            const historyData = manywho.model.getHistory(this.props.flowKey);

            return <div className={'panel panel-default history-view'}>
                <div className={'panel-heading'}>
                    <h3 className={'panel-title'}>History'</h3>
                </div>
                <div className={'panel-body'}>
                    {
                        this.renderSteps(historyData)
                    }
                </div>
            </div>;
        }

        return null;
    }
}

manywho.component.register(registeredComponents.HISTORY, History);

export const getHistory = () : typeof History => manywho.component.getByName(registeredComponents.HISTORY) || History;

export default History;
