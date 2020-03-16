import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

import '../../css/debug.less';

interface IDebugViewerState {
    paths?: any;
    toggle?: any;
}

class DebugViewer extends React.Component<IComponentProps, IDebugViewerState> {

    constructor(props) {
        super(props);

        this.state = {
            paths: {},
            toggle: {},
        };

        this.toggleValue = this.toggleValue.bind(this);
        this.toggleHeader = this.toggleHeader.bind(this);
        this.onBreadcrumbClick = this.onBreadcrumbClick.bind(this);
        this.onValueViewClick = this.onValueViewClick.bind(this);
        this.renderValues = this.renderValues.bind(this);
        this.renderValue = this.renderValue.bind(this);
        this.renderLogEntries = this.renderLogEntries.bind(this);
    }

    onBreadcrumbClick(e) {
        e.stopPropagation();

        const { paths } = this.state;
        const valueElementId = e.currentTarget.getAttribute('data-value-id');
        const breadcrumbs =
            Array.prototype.slice.call(e.currentTarget.parentNode.parentNode.childNodes);
        const index = breadcrumbs.indexOf(e.currentTarget.parentNode);

        if (index !== -1) {

            if (index === 0) {
                paths[valueElementId] = '';

            } else {
                paths[valueElementId] =
                    paths[valueElementId].split('.').slice(0, index).join('.');
            }
        }

        this.setState({
            paths,
        });

    }

    onValueViewClick(e) {
        const { paths } = this.state;
        const valueElementId = e.currentTarget.getAttribute('data-value-id');
        const pathPart = e.currentTarget.getAttribute('data-path-part');

        paths[valueElementId] =
            (`${(paths[valueElementId] || '')}.${pathPart}`).replace(/^\./gi, '');

        this.setState({
            paths,
        });
    }

    getValueByPath = (obj: any, path: string): any => {
        let objectData = obj;

        if (!path || path === '') {
            return objectData;
        }

        try {
            const parts = path.split('.');

            for (let i = 0; i < parts.length; i += 1) {
                let foundKey = null;

                Object.keys(objectData).forEach((key) => {
                    if (key.toLowerCase() === parts[i].toLowerCase()) {
                        foundKey = key;
                    }
                });

                if (foundKey) {
                    objectData = obj[foundKey];
                }
                else {
                    objectData = undefined;
                }
            }
            return objectData;

        } catch (ex) {
            return undefined;
        }
    };

    toggleValue(e) {
        e.stopPropagation();

        const { toggle } = this.state;
        const valueElementId = e.currentTarget.dataset.valueId;

        toggle[valueElementId] = !toggle[valueElementId];

        this.setState({
            toggle,
        });
    }

    toggleHeader(e) {
        const { toggle } = this.state;
        toggle[e.currentTarget.id] = !toggle[e.currentTarget.id];

        this.setState({
            toggle,
        });
    }

    renderValues(title, id, values = [], name, idName) {

        const isExpanded = this.state.toggle[id] || false;

        return (
            <div className="debug-root" key={id}>
                <div className="debug-root-toggle" id={id} onClick={this.toggleHeader} role="presentation">
                    <span className={`glyphicon glyphicon-triangle-${((isExpanded) ? 'bottom' : 'right')}`} />
                    <h5 className="debug-title">
                        {title}
                    </h5>
                    <span className="label label-info">
                        {values.length}
                    </span>
                </div>
                <ul className={`list-unstyled debug-values ${((isExpanded) ? '' : 'hidden')}`}>
                    {
                        values.map(
                            value => this.renderValue(
                                this.state.paths[value[idName]] || '', value, name, idName,
                            ),
                            this,
                        )
                    }
                </ul>
            </div>
        );

    }

    renderValue(path, value, name, idName) {

        const isExpanded = this.state.toggle[value[idName]] || false;
        const properties = this.getValueByPath(value, path);

        const fullPath = `${value[name]} . ${path}`;

        return (
            <li className="clearfix" key={value[idName]}>
                <span
                    className={`glyphicon debug-value-toggle glyphicon-triangle-'${((isExpanded) ? 'bottom' : 'right')}`}
                    data-value-id={value[idName]}
                    onClick={this.toggleValue}
                    role="presentation"
                />
                <div className="debug-value">

                    <ol
                        className="breadcrumb debug-value-breadcrumb"
                        data-value-id={value[idName]}
                        onClick={this.toggleValue}
                        role="presentation"
                    >
                        {
                            fullPath.split('.').map(
                                (part) => {
                                    if (!manywho.utils.isNullOrWhitespace(part)) {
                                        return (
                                            <li key={value[idName]}>
                                                <button
                                                    className="btn btn-link btn-sm"
                                                    onClick={this.onBreadcrumbClick}
                                                    data-value-id={value[idName]}
                                                >
                                                    {part}
                                                </button>
                                            </li>
                                        );
                                    }

                                    return null;

                                },
                                this,
                            )
                        }
                    </ol>
                    <table className={`table table-striped table-bordered debug-value-table ${((isExpanded) ? '' : 'hidden')}`}>
                        <tbody>
                            {
                                Object.keys(properties).map(
                                    (propertyName) => {

                                        let propertyValue = properties[propertyName];
                                        let propertyCaption = propertyName;

                                        if (typeof propertyValue === 'object' && propertyValue) {

                                            if (propertyValue.developerName) {
                                                propertyCaption = propertyValue.developerName;
                                            }

                                            propertyValue = (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    data-value-id={value[idName]}
                                                    data-path-part={propertyName}
                                                    onClick={this.onValueViewClick}
                                                >
                                                    View
                                                </button>
                                            );
                                        }

                                        return (
                                            <tr key={value[idName]}>
                                                <td>{propertyCaption}</td>
                                                <td>{propertyValue || 'null'}</td>
                                            </tr>
                                        );
                                    },
                                    this,
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </li>
        );
    }

    renderLogEntries(entries) {
        const isExpanded = this.state.toggle.executionlog;

        return (
            <div className="debug-root" key="debug-root">
                <div
                    className="debug-root-toggle"
                    id="executionlog"
                    onClick={this.toggleHeader}
                    role="presentation"
                >

                    <span className={`glyphicon glyphicon-triangle-${((isExpanded) ? 'bottom' : 'right')}`} />
                    <h5 className="debug-title">Execution Log</h5>
                    <span className="label label-info">{entries.length}</span>
                </div>
                <div className={isExpanded ? null : 'hidden'}>
                    <table className="table table-striped">
                        <tr>
                            <th>Timestamp</th>
                            <th>Message</th>
                            <th>Data</th>
                        </tr>
                        {
                            manywho.utils.convertToArray(entries).map((entry) => {

                                const timeStamp = new Date(entry.timestamp);

                                return (
                                    <tr key={entry.timestamp}>
                                        <td>{timeStamp.toLocaleString()}</td>
                                        <td>{entry.message}</td>
                                        { /* TODO: display data */}
                                    </tr>
                                );
                            })
                        }
                    </table>
                </div>
            </div>
        );
    }

    render() {
        if (manywho.settings.isDebugEnabled(this.props.flowKey)) {

            manywho.log.info('Rendering Debug');

            const rootFaults = manywho.model.getRootFaults(this.props.flowKey) || [];
            const preCommitStateValues =
                manywho.model.getPreCommitStateValues(this.props.flowKey) || [];
            const stateValues = manywho.model.getStateValues(this.props.flowKey) || [];
            const flowFrames = manywho.model.getFrames(this.props.flowKey) || [];
            const executionLog = manywho.model.getExecutionLog(this.props.flowKey) || {};

            const componentErrors = [];

            Object.keys(manywho.state.getComponents(this.props.flowKey)).forEach((id) => {
                if (manywho.state.getComponents(this.props.flowKey)[id].error) {
                    componentErrors.push(
                        manywho.state.getComponents(this.props.flowKey)[id].error,
                    );
                }
            });

            const children = [
                this.renderValues(
                    'Root Faults', 'rootfaults', rootFaults, 'name', 'name',
                ),
                this.renderValues(
                    'Component Errors', 'componenterrors', componentErrors, 'id', 'id',
                ),
                this.renderValues(
                    'Pre-Commit State Values', 'precommitstatevalues',
                    preCommitStateValues, 'developerName', 'valueElementId',
                ),
                this.renderValues(
                    'State Values', 'statevalues', stateValues, 'developerName',
                    'valueElementId',
                ),
                this.renderValues(
                    'Frames', 'frames', flowFrames, 'flowDeveloperName',
                    'flowDeveloperName',
                ),
                this.renderLogEntries(executionLog.entries || []),
            ];

            return (
                <div className="panel panel-default debug">
                    <div className="panel-heading">
                        <h3 className="panel-title">Debug</h3>
                    </div>
                    <div className="panel-body">{children}</div>
                </div>
            );
        }
        return null;
    }

}

manywho.component.register(registeredComponents.DEBUG, DebugViewer);

export const getDebugViewer = () : typeof DebugViewer => manywho.component.getByName(registeredComponents.DEBUG) || DebugViewer;

export default DebugViewer;
