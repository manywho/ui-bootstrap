import * as React from 'react';
import { str, int } from '../test-utils';

import { mount } from 'enzyme';

import InputDateTime from '../js/components/input-datetime';

const globalAny:any = global;

const mockDatetimepicker = jest.fn((options) => {
    return { on: jest.fn() };
});

globalAny['datetimepickerMock'] = mockDatetimepicker;

const mockDateObject = {
    utc() {
        return mockDateObject;
    },
    local() {
        return true;
    },
    format() {
        return str();
    },
    year() {
        return 'xxx';
    },
    month() {
        return 'xxx';
    },
    date() {
        return 'xxx';
    }
}

jest.mock('moment', mockDateObject);

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

    function manyWhoInput(useCurrent = false, dateTimeFormat = null, value = str()) {

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
        globalAny.window.manywho.settings.global = jest.fn(() => true);

        const props = {
            id: str(),
            value,
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
            autofocusCandidate: true,
        };

        return (
            <InputDateTime {...props} />
        );
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = mount(manyWhoInput());
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = mount(manyWhoInput());
        expect(globalAny.window.manywho.component.register)
            .toHaveBeenCalledWith('input-datetime', InputDateTime);
    });

    test('The datepicker plugin gets instantiated', () => {
        componentWrapper = mount(manyWhoInput(true));
        expect(globalAny.datetimepickerMock).toHaveBeenCalled();
    });

    test('If value prop is a date that datepicker plugin gets called', () => {
        componentWrapper = mount(manyWhoInput(true, null, '2018-02-16T00:00:00.0000000+00:00'));
        expect(globalAny.datetimepickerMock).toHaveBeenCalled();
    });

    test('utility function is called to determine if the datepicker plugin should default to the current date', () => {
        componentWrapper = mount(manyWhoInput( true));
        expect(globalAny.window.manywho.utils.isEqual).toHaveBeenCalledWith(true, 'true', true);
    });

    test('datepicker plugin uses datetime format from model attributes', () => {
        const expectedArgs = {
            format: 'YYYY-MM-DD',
        };

        componentWrapper = mount(manyWhoInput( false, 'YYYY-MM-DD'));
        expect(globalAny.datetimepickerMock).toHaveBeenCalledWith(
            expect.objectContaining(expectedArgs),
        );
    });

    test('setPickerDate is called with correct null value', () => {
        const mockSetPickerDate = jest.spyOn(InputDateTime.prototype, 'setPickerDate');

        componentWrapper = mount(manyWhoInput(false, 'YYYY/MM/DD', '2018/12/25'));
        expect(mockSetPickerDate).toHaveBeenCalledWith('2018/12/25');

        componentWrapper.setProps({ value: null });
        expect(mockSetPickerDate).toHaveBeenCalledWith(null);
    });

    test('make sure backspace doesn\'t clear input', () => {
        const mockSetPickerDate = jest.spyOn(InputDateTime.prototype, 'setPickerDate');

        componentWrapper = mount(manyWhoInput( false, 'DD/MM/YYYY', '25/12/2018'));
        expect(mockSetPickerDate).toHaveBeenCalledWith('25/12/2018');

        componentWrapper.find(InputDateTime).simulate('keydown', {keyCode: 8});
        expect(componentWrapper.find(InputDateTime).props().value).toBeTruthy();
    });

    test('setPickerDate is called with correct date value', () => {
        const mockSetPickerDate = jest.spyOn(InputDateTime.prototype, 'setPickerDate');

        componentWrapper = mount(manyWhoInput(false, 'YYYY/MM/DD', '2018/12/25'));
        expect(mockSetPickerDate).toHaveBeenCalledWith('2018/12/25');

        componentWrapper.setProps({ value: '2017/11/24' });
        expect(mockSetPickerDate).toHaveBeenCalledWith('2017/11/24');
    });

    test('on input mount when autofocusCandidate is activate', () => {
        const input = manyWhoInput();

        expect(document.activeElement.id).toEqual('');
        expect(document.activeElement.nodeName).toEqual('BODY');

        componentWrapper = mount(input);

        expect(document.activeElement.nodeName).toEqual('INPUT');
        expect(document.activeElement.id).toEqual(componentWrapper.instance().props.id);
    });

});
