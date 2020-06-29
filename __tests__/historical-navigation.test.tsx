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

    test('navigate is called with correct entry path', () => {

        const flowKey = 'xxx';

        const entries = [
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "941d7cc7-dadd-483b-8101-779f1925841a",
                "mapElementName": "Step 1",
                "stateEntryId": "169c308f-d585-46d0-80ed-03962dd486a3",
            },
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "88a2a87f-baf2-4a84-8697-ad616d7daeef",
                "mapElementName": "Step 2",
                "stateEntryId": "269c308f-d585-46d0-80ed-03962dd486a3",
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
        expect(navigateSpy).toBeCalledWith(null, null, null, flowKey, entries[1].stateEntryId);
    });

    test('Current map element name is displayed when historical navigation entries is empty', () => {

        const flowKey = 'xxx';

        const entries = [];

        jest.spyOn(globalAny.window.manywho.model, 'getHistoricalNavigation').mockImplementation(
            () => ({ entries }),
        ); 

        jest.spyOn(globalAny.window.manywho.model, 'getMapElement')
        .mockImplementationOnce(
            () => null,
        )
        .mockImplementationOnce(
            () => ({
                name: 'abc'
            }),
        );

        const wrapper1 = shallow(<HistoricalNavigation flowKey={flowKey} />);
        expect(wrapper1.find('li').length).toBe(0);

        const wrapper2 = shallow(<HistoricalNavigation flowKey={flowKey} />);
        expect(wrapper2.find('li').length).toBe(1);
        expect(wrapper2.find('ul').childAt(0).text()).toBe('abc');
    });

    test('Current map element name is displayed at end of navigation list', () => {

        const flowKey = 'xxx';

        const entries = [
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "941d7cc7-dadd-483b-8101-779f1925841a",
                "mapElementName": "Step 1",
                "stateEntryId": "169c308f-d585-46d0-80ed-03962dd486a3",
            },
            {
                "flowId": "369c308f-d585-46d0-80ed-03962dd486a3",
                "mapElementId": "88a2a87f-baf2-4a84-8697-ad616d7daeef",
                "mapElementName": "Step 2",
                "stateEntryId": "269c308f-d585-46d0-80ed-03962dd486a3",
            }
        ];

        jest.spyOn(globalAny.window.manywho.model, 'getHistoricalNavigation').mockImplementationOnce(
            () => ({ entries }),
        ); 

        jest.spyOn(globalAny.window.manywho.model, 'getMapElement').mockImplementationOnce(
            () => ({
                name: 'abc'
            }),
        );
        const wrapper2 = shallow(<HistoricalNavigation flowKey={flowKey} />);
        expect(wrapper2.find('li').length).toBe(3);
        expect(wrapper2.find('ul').childAt(2).text()).toBe('abc');
    });
});
