import { str } from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Chart from '../js/components/chart';
import ChartPie from '../js/components/chart-pie';

describe('Chart Pie component behaviour', () => {

    let componentWrapper;
    let propId;
    let propFlowKey;

    const globalAny:any = global;

    function manyWhoMount() {

        propId = str(5);
        propFlowKey = str(5);

        return shallow(<ChartPie flowKey={propFlowKey} id={propId} />);
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.registerItems)
        .toHaveBeenCalledWith('chart-pie', ChartPie); 
    });

    test('Chart gets called with correct props', () => {
        componentWrapper = manyWhoMount();
        expect(
            componentWrapper.find(Chart).props(),
        ).toEqual(
            expect.objectContaining({ 
                type: 'pie' ,
            }),
        );
    });

});
