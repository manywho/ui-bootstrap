import * as React from 'react';
import { str, int } from '../test-utils';

import { mount, shallow } from 'enzyme';

import InputDateTime from '../js/components/input-datetime';

const globalAny:any = global;

const mockDatetimepicker = jest.fn((options) => {
    return { on: jest.fn() };
});

globalAny['datetimepickerMock'] = mockDatetimepicker;

jest.mock('jquery', () => {
    return jest.fn(() => {
        return {
            datetimepicker: mockDatetimepicker,
            data: () => ({
                date: () => 'xxx',
                destroy: () => {},
            }),
        };
    });
});

jest.mock('../js/lib/100-datetimepicker.js', () => 'xxx');

describe('InputDateTime component behaviour', () => {

    let componentWrapper;
    let model;

    function manyWhoMount(isShallow = false, useCurrent = false, dateTimeFormat = null) {

        model = {
            attributes: {
                dateTimeFormat,
                useCurrent,
                dateTimeLocale: 'en-us',
            },
        };

        globalAny.window.manywho.model.getComponent = jest.fn(() => model),
        globalAny.window.manywho['utils'] = {
            isEqual: jest.fn(),
        };

        globalAny.window.moment = () => ({
            utc() {
                return {
                    format() { 
                        return str();
                    },
                };
            },
            local() {
                return true;
            },
        });

        const props = {
            value: str(),
            placeholder: str(),
            onChange: () => {},
            onBlur: () => {},
            required: false,
            disabled: false,
            readOnly: false,
            size: int(30, 200),
            format: str(),
            isDesignTime: false,
            autocomplete: str(),
        };

        if (isShallow === true)
            return shallow(<InputDateTime {...props} />);

        return mount(<InputDateTime {...props} />);
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
        .toHaveBeenCalledWith('input-datetime', InputDateTime); 
    });

    test('The datepicker plugin gets instantiated', () => {
        componentWrapper = manyWhoMount(false, true);
        expect(globalAny.datetimepickerMock).toHaveBeenCalled(); 
    });

    test('An empty date will return true', () => {
        componentWrapper = manyWhoMount();
        const componentWrapperInstance = componentWrapper.instance();
        expect(componentWrapperInstance.isEmptyDate(null)).toBeTruthy();
        expect(componentWrapperInstance.isEmptyDate('01/01/0001')).toBeTruthy();
        expect(componentWrapperInstance.isEmptyDate('1/1/0001')).toBeTruthy();
        expect(componentWrapperInstance.isEmptyDate('0001-01-01')).toBeTruthy();
    });

    test('A valid date will return false', () => {
        componentWrapper = manyWhoMount();
        const componentWrapperInstance = componentWrapper.instance();
        expect(componentWrapperInstance.isEmptyDate('07/12/1986')).toBeFalsy();
    });

    test('utility function is called to determine if the datepicker plugin should default to the current date', () => {
        componentWrapper = manyWhoMount(false, true);
        expect(globalAny.window.manywho.utils.isEqual).toHaveBeenCalledWith(true, 'true', true);
    });

    test('datepicker plugin uses datetime format from model attributes', () => {
        const expectedArgs = {
            format: 'YYYY-MM-DD',
        };

        componentWrapper = manyWhoMount(false, false, 'YYYY-MM-DD');
        expect(globalAny.datetimepickerMock).toHaveBeenCalledWith(
            expect.objectContaining(expectedArgs),
        );
    });

});
