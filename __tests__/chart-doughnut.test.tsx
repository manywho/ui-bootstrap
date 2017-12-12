import { str } from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Chart from '../js/components/chart';
import ChartDoughnut from '../js/components/chart-doughnut';

describe('Chart Doughnut component behaviour', () => {

    let componentWrapper;
    let propId;
    let propFlowKey;

    const globalAny:any = global;

    function manyWhoMount(label = null) {

        propId = str(5);
        propFlowKey = str(5);

        return shallow(<ChartDoughnut flowKey={propFlowKey} id={propId} />);
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
        .toHaveBeenCalledWith('chart-doughnut', ChartDoughnut); 
    });

    test('Chart gets called with correct props', () => {
        componentWrapper = manyWhoMount('label');
        expect(
            componentWrapper.find(Chart).props(),
        ).toEqual(
            expect.objectContaining({ 
                type: 'doughnut' ,
            }),
        );
    });

});
