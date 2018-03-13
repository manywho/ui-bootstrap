import { str } from '../test-utils';


import * as React from 'react';
import { mount } from 'enzyme';

import ChartBase from '../js/components/chart-base';

jest.mock('chart.js', () => {
    return {
        Chart() {
            this.destroy = jest.fn();
        },
    };
});


describe('ChartBase component behaviour', () => {

    let componentWrapper;

    const globalAny: any = global;

    function manyWhoMount(
        // props
        {
            id = str(5),
            flowKey = str(5),
            isVisible = true,
            columns = [],
            onClick = null,
            type = str(5), 
            width = 0,
            height = 0,
            objectData = [], 
            options = {}, 
            isLoading = false,
            labels = [],
        } = {},
    ) {

        globalAny.window.manywho.styling.getClasses = () => [str(5)];

        const props = {
            id, flowKey, isVisible, columns, onClick, type, width, height,
            objectData, options, isLoading, labels,
        };

        return mount(<ChartBase {...props} />);
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
        expect(globalAny.window.manywho.component.register)
            .toHaveBeenCalledWith('mw-chart-base', ChartBase);
    });

});
