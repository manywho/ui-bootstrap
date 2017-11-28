import testUtils from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Chart from '../js/components/chart';
import ChartBar from '../js/components/chart-bar';

describe('Horizontal component behaviour', () => {

    let componentWrapper;
    let propId;
    let propFlowKey;

    const globalAny:any = global;

    function manyWhoMount(label = null) {

        propId = testUtils.generateRandomString(5);
        propFlowKey = testUtils.generateRandomString(5);

        globalAny.window.manywho.utils = {
            isNullOrWhitespace: jest.fn(() => {
                return label === null;
            }),
        };

        globalAny.window.manywho.model = {
            getComponent: jest.fn(() => ({ 
                attributes: {
                    label,
                },
            })),
            getChildren: jest.fn(() => []),
        };

        return shallow(<ChartBar flowKey={propFlowKey} id={propId} />);
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
        .toHaveBeenCalledWith('chart-bar', ChartBar); 
    });

    test('Chart gets called with correct props', () => {
        componentWrapper = manyWhoMount('label');
        expect(
            componentWrapper.find(Chart).props(),
        ).toEqual(
            expect.objectContaining({ 
                type: 'bar' ,
                options: {
                    legend: {
                        display: true,
                    },
                },
            }),
        );
    });

});
