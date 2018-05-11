import { str } from '../test-utils';


import * as React from 'react';
import { shallow } from 'enzyme';

import { default as ChartContainer } from '../js/components/chart-container';
import Wait from '../js/components/wait';
import ChartBase from '../js/components/chart-base';


describe('ChartContainer component behaviour', () => {

    let componentWrapper;

    const globalAny: any = global;

    function manyWhoMount(
        // props
        {
            id = str(5),
            flowKey = str(5),
            children = [
                {
                    columns: {},
                },
            ],
            isDesignTime = false,
        } = {},
        // model
        {
            isVisible = true,            
        } = {},
        // other   
        {
            objectDataRequest = null,
            loading = false,
            width = 0,
            height = 0,
            label = '',
        } = {},
    ) {

        globalAny.window.manywho.styling.getClasses = () => [str(5)];

        const props = {
            id, flowKey, children, isDesignTime,
        };
        
        globalAny.window.manywho.model.getContainer = () => ({
            isVisible,
            objectDataRequest,
        });
        globalAny.window.manywho.model.getChildren = jest.fn(() => [{}]);
        globalAny.window.manywho.model.getComponent = () => ({
            width, height, label, columns: [],
        });

        globalAny.window.manywho.state.getComponent = () => ({
            loading,
        });

        globalAny.window.manywho.component.getDisplayColumns = () => ([
            { label: str(5) },
            { label: str(5) },
        ]);

        return shallow(<ChartContainer {...props} />);
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
        expect(globalAny.window.manywho.component.registerContainer)
            .toHaveBeenCalledWith('charts', ChartContainer);
    });

    test('Container renders an empty div when in design time', () => {
        componentWrapper = manyWhoMount(
            {
                isDesignTime: true,
            },
        );

        expect(componentWrapper.find('.clearfix').length).toBe(1);
    });

    test('Refresh button renders when not in design time', () => {

        componentWrapper = manyWhoMount(
            {
                isDesignTime: false,
            },
            undefined,
            {
                objectDataRequest: {},
            },
        );

        expect(componentWrapper.find('.glyphicon-refresh').length).toBe(1);
    });

    test('Refresh is called when refresh button is clicked', () => {

        componentWrapper = manyWhoMount(
            {
                isDesignTime: false,
            },
            undefined,
            {
                objectDataRequest: {},
            },
        );

        componentWrapper.find('.glyphicon-refresh').parent().simulate('click');

        expect(manywho.model.getChildren).toHaveBeenCalled();
    });

    test('Wait renders when any children are loading', () => {
        componentWrapper = manyWhoMount(
            undefined,
            undefined,
            {
                loading: true,
            },
        );

        expect(componentWrapper.find(Wait).props()).toEqual(expect.objectContaining({
            isVisible: true,
        }));
    });

    test('ChartBase is given the correct props', () => {
        componentWrapper = manyWhoMount(
            undefined,
            {
                isVisible: true,
            },
            {
                width: 24,
                height: 89,
                label: 'label',
            },
        );

        expect(componentWrapper.find(ChartBase).props()).toEqual(expect.objectContaining({
            isVisible: true,
            width: 24,
            height: 89,
            labels: ['label'],
        }));
    });

});
