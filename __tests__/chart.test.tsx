import { str, int } from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Chart from '../js/components/chart';
import ItemsHeader from '../js/components/items-header';
import Wait from '../js/components/wait';
import ChartBase from '../js/components/chart-base';

describe('Chart component behaviour', () => {

    let componentWrapper;

    const globalAny: any = global;

    function manyWhoMount(
        // props
        {
            id = str(5),
            flowKey = str(5),
            parentId = str(5),
            isDesignTime = false, contentElement = null, outcomes = [],
            objectData = null, options = {}, isLoading = false, onOutcome = jest.fn(),
            type = str(5), refresh = jest.fn(),
        } = {},
        // model
        {
            isVisible = true,
            isValid = true,
            validationMessage = '',
            attributes = {},
            label = null,
            width = 0,
            height = 0,
        } = {},
        // state
        {
            loading = null,
        } = {},
    ) {

        globalAny.window.manywho.styling.getClasses = () => [str(5)];

        const props = {
            id, flowKey, parentId, isDesignTime, contentElement, outcomes,
            objectData, options, isLoading, onOutcome, type, refresh,
        };
        
        globalAny.window.manywho.model.getComponent = () => ({
            isVisible,
            isValid,
            validationMessage,
            attributes,
            label,
            width,
            height,
            developerName: str(5),
            columns: [],
            helpInfo: str(5),
        });
        
        globalAny.window.manywho.state.getComponent = () => ({ loading });

        return shallow(<Chart {...props} />);
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
            .toHaveBeenCalledWith('mw-chart', Chart);
    });

    test('Component renders validation message when chart is invalid', () => {
        const validationMessage = str(5);

        componentWrapper = manyWhoMount(
            undefined,
            {
                validationMessage,
                isValid: false,
            },
        );

        expect(componentWrapper.find('.has-error .help-block').text()).toEqual(validationMessage);
    });

    test('Chart is hidden when isVisible is model.false', () => {

        componentWrapper = manyWhoMount(
            undefined,
            {
                isVisible: false,
            },
        );

        expect(componentWrapper.hasClass('hidden')).toBe(true);
    });

    test('Chart has receives classes from model', () => {

        componentWrapper = manyWhoMount(
            undefined,
            {
                attributes: {
                    classes: 'fu bar',
                },
            },
        );

        expect(componentWrapper.hasClass('fu bar')).toBe(true);
    });

    test('Chart renders label when required', () => {
        const label = str(5);

        componentWrapper = manyWhoMount(
            undefined,
            {
                label,
            },
        );

        expect(componentWrapper.find('label').text()).toBe(label);
    });

    test('ItemsHeader renders when not design time', () => {

        componentWrapper = manyWhoMount({
            isDesignTime: false,
        });

        expect(componentWrapper.find(ItemsHeader).length).toBe(1);
    });

    test('Wait renders when loading', () => {
        const message = str(5);

        componentWrapper = manyWhoMount(
            {
                isLoading: true,
            },
            undefined,
            {
                loading: {
                    message,
                },
            },
        );

        expect(componentWrapper.find(Wait).props()).toEqual(expect.objectContaining({
            message,
            isVisible: true,
        }));
    });
    
    test('ChartBase receives width, height and onClick props', () => {
        const width = int(1, 100);
        const height = int(1, 100);

        componentWrapper = manyWhoMount(
            {
                isDesignTime: false,
            },
            {
                width,
                height,
            },
        );

        expect(componentWrapper.find(ChartBase).props()).toEqual(expect.objectContaining({
            width,
            height,
            onClick: expect.any(Function),
        }));
    });

});
