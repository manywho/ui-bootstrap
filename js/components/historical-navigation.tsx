import * as React from 'react';
import IComponentProps from '../interfaces/IComponentProps';
import registeredComponents from '../constants/registeredComponents';

import '../../css/historical-navigation.less';

declare const manywho: any;

const navigateToPath = (flowKey, path) => {
    manywho.engine.navigate(null, null, null, flowKey, path);
};

/**
 * @description Renders a list of navigation links to previously visited map elements
 */
const HistoricalNavigation:React.FC<IComponentProps> = ({ flowKey }) => {

    const [expanded, setExpanded] = React.useState(false);

    const navigation = manywho.model.getHistoricalNavigation(flowKey);

    const onEntryClick = (entry) => {
        setExpanded(false); 
        navigateToPath(flowKey, entry.path);
    };

    // When any outcome is clicked we want to collapse the history nav
    const handleClick = ({ target }) => {           
        if (target.classList.contains('outcome') || target.closest('.outcome')) {
            setExpanded(false);
        }
    };
    
    React.useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [handleClick]);

    if (navigation && navigation.entries && navigation.entries.length > 0) {

        return (
            <nav className={`historical-navigation${expanded ? ' expanded' : ''}`}>
                <ul>
                    {
                        navigation.entries.map((entry, index) => (
                            <li key={index}>
                                <button className="btn btn-link" onClick={() => onEntryClick(entry)}>
                                {
                                    entry.mapElementName
                                }
                                </button>
                                {
                                    index === 0 ? (
                                        <button 
                                            title="expand"
                                            className="historical-navigation-expand"
                                            onClick={() => setExpanded(true)}
                                        >
                                            <span>expand</span>
                                        </button> 
                                    ): null
                                }
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
