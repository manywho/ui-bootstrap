import * as React from 'react';
import { shallow } from 'enzyme';

import HistoricalNavigation from '../js/components/historical-navigation';

describe('HistoricalNavigation component behaviour', () => {

    const globalAny:any = global;


    test('Component renders without crashing', () => {
        const componentWrapper = shallow(<HistoricalNavigation />);
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        shallow(<HistoricalNavigation />);
        expect(globalAny.window.manywho.component.register)
        .toHaveBeenCalledWith('historical-navigation', HistoricalNavigation); 
    });

    test('Component gets registered', () => {

        const flowKey = 'xxx';

        const entries = [
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "941d7cc7-dadd-483b-8101-779f1925841a",
                "mapElementName": "Step 1",
                "path": [
                    {
                        "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                        "mapElementId": "941d7cc7-dadd-483b-8101-779f1925841a"
                    }
                ]
            },
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "88a2a87f-baf2-4a84-8697-ad616d7daeef",
                "mapElementName": "Step 2",
                "path": [
                    {
                        "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                        "mapElementId": "88a2a87f-baf2-4a84-8697-ad616d7daeef"
                    }
                ]
            }
        ];

        jest.spyOn(globalAny.window.manywho.model, 'getHistoricalNavigation').mockImplementationOnce(
            () => ({ entries }),
        ); 
        
        const navigateSpy = jest.spyOn(globalAny.window.manywho.engine, 'navigate');

        const componentWrapper = shallow(<HistoricalNavigation flowKey={flowKey} />);
        expect(componentWrapper.find('li').length).toBe(2);
        expect(componentWrapper.find('ul').childAt(1).text()).toBe("Step 2");

        componentWrapper.find('ul').childAt(1).find('button').simulate('click');
        expect(navigateSpy).toBeCalledWith(null, null, null, flowKey, entries[1].path);
    });
});
