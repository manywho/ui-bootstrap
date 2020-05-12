import * as React from 'react';
import IComponentProps from '../interfaces/IComponentProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/historical-navigation.less';

declare const manywho: any;

const navigateToPath = (flowKey, path) => {
    manywho.engine.navigate(null, null, null, flowKey, path);
};

/**
 * @description :TODO
 */

const HistoricalNavigation:React.FC<IComponentProps> = ({ flowKey }) => {

    const navigation = manywho.model.getHistoricalNavigation(flowKey);

    if (navigation && navigation.entries && navigation.entries.length > 0) {

        return (
            <nav className="historical-navigation">
                <ul>
                    {
                        navigation.entries.map((entry, index) => (
                            <li key={index}>
                                <button className="btn btn-link" onClick={() => navigateToPath(flowKey, entry.path)}>
                                {
                                    entry.mapElementName
                                }
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        );
    }

    return null;

}

manywho.component.register(registeredComponents.HISTORICAL_NAVIGATION, HistoricalNavigation);

export const getHistoricalNavigation = () : typeof HistoricalNavigation => manywho.component.getByName(registeredComponents.HISTORICAL_NAVIGATION) || HistoricalNavigation;

export default HistoricalNavigation;
