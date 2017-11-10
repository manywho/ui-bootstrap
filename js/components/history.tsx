(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const History: React.SFC<IComponentProps> = ({ id, flowKey }) => {

        const onClick = (e) => {

            manywho.model.popHistory(e.currentTarget.id, flowKey);

            manywho.engine.navigate(id, null, e.currentTarget.id, flowKey);

        };

        const renderOutcome = (outcome, selectedOutcome, outcomeWidth) => {

            let classes = 'outcome-info alert ';
            if (outcome.id === selectedOutcome) classes += ' selected-outcome';

            return <div className={classes} style={{ width: outcomeWidth }}>
                <p align={'center'}>
                {outcome.label}
                </p>
            </div>;

        };

        const renderSteps = (history) => {

            return history.map(
                (step, index) => {

                    if (index < history.length - 1 && step.name) {

                        const outcomes = step.outcomes || [];

                        const outcomeWidth = Math.floor(100 / outcomes.length) - 2 + '%';

                        return <div className={'history-row'}>
                            <div id={step.id} className={'step bg-primary'} onClick={onClick}>
                                <div className={'step-title' }>
                                    {step.label || step.name}
                                </div>
                                <div className={'step-content'} 
                                    dangerouslySetInnerHTML={{__html: step.content || '' }}>
                                </div>
                            </div>
                            {
                                outcomes.map(
                                    (outcome) => {
                                        return this.renderOutcome(
                                            outcome, step.selectedOutcome, outcomeWidth,
                                        );
                                    }, 
                                    this,
                                )
                            }
                        </div>;
                    }
                }, 
                this,
            );
        };


        if (
            manywho.settings.global('history', flowKey) && 
            !manywho.settings.isDebugEnabled(flowKey)
        ) {
            const historyData = manywho.model.getHistory(flowKey);

            return (
                <div className={'panel panel-default history-view'}>
                    <div className={'panel-heading'}>
                        <h3 className={'panel-title'}>
                            History
                        </h3>
                    </div>
                    <div className={'panel-body' }>
                        {this.renderSteps(historyData)}
                    </div>
                </div>
            );
        }

        return null;
    };

    manywho.component.register('history', History);

}(manywho));
