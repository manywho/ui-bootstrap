import { str } from '../test-utils';

import * as React from 'react';
import * as moment from 'moment';

import { mount, shallow } from 'enzyme';

import TableInputDateTime from '../js/components/table-input-datetime';

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

describe('Table Input Datetime component behaviour', () => {

    let tableInputDatetimeWrapper;
    let props;

    function manyWhoMount(value = null, isShallow = false, format = str(10)) {
        props = {
            value,
            format,
            id: str(10),
            parentId: str(10),
            flowKey: str(10),
            onChange: jest.fn(() => {
                return true;
            }),
            contentFormat: null,
        };

        if (isShallow === false)
            return mount(<TableInputDateTime {...props} />);
        return shallow(<TableInputDateTime {...props} />);
    }

    afterEach(() => {
        tableInputDatetimeWrapper.unmount();
    });

    test('Table Input Datetime component renders without crashing', () => {
        tableInputDatetimeWrapper = manyWhoMount();
        expect(tableInputDatetimeWrapper.length).toEqual(1);
    });

    test('Table Input Datetime component gets registered', () => {
        tableInputDatetimeWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('The datepicker plugin gets instantiated', () => {
        tableInputDatetimeWrapper = manyWhoMount();
        expect(globalAny.datetimepickerMock).toHaveBeenCalled(); 
    });

    test('A default date gets set', () => {
        const testDate = moment(
            '07-12-1986', 
            ['MM/DD/YYYY hh:mm:ss A ZZ', moment.ISO_8601, ''],
        );
        const expectedArgs = {
            defaultDate: testDate,
            inline: true,
            sideBySide: true,
            useCurrent: false,
        };

        tableInputDatetimeWrapper = manyWhoMount('07-12-1986', true);
        expect(globalAny.datetimepickerMock).toHaveBeenCalledWith(
            expectedArgs,
        ); 
    });

    test('A default date does not get set', () => {
        const expectedArgs = {
            defaultDate: null,
            inline: true,
            sideBySide: true,
            useCurrent: false,
        };

        tableInputDatetimeWrapper = manyWhoMount();
        expect(globalAny.datetimepickerMock).toHaveBeenCalledWith(
            expectedArgs,
        ); 
    });

    test('Date gets formatted on change event', () => {
        const event = {
            date: {
                format: jest.fn(),
            },
        };
        tableInputDatetimeWrapper = manyWhoMount(null, true);
        const wrapperInstance = tableInputDatetimeWrapper.instance();
        wrapperInstance.onChange(event);
        expect(props.onChange).toHaveBeenCalled();
        expect(event.date.format).toHaveBeenCalledWith(props.format);
    });

    test('Date format function gets called with no args if no format is defined', () => {
        const event = {
            date: {
                format: jest.fn(),
            },
        };
        tableInputDatetimeWrapper = manyWhoMount(null, true, null);
        const wrapperInstance = tableInputDatetimeWrapper.instance();
        wrapperInstance.onChange(event);
        expect(event.date.format).toHaveBeenCalled();
    });
});
