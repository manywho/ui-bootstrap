import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import TableInputDateTime from '../js/components/table-input-datetime';

describe('Table Input Datetime component behaviour', () => {

    let tableInputDatetimeWrapper;
    const globalAny:any = global;
    const props = {
        id: testUtils.generateRandomString(10),
        parentId: testUtils.generateRandomString(10),
        flowKey: testUtils.generateRandomString(10),
        onChange: jest.fn(),
        format: testUtils.generateRandomString(10),
        value: null,
        contentFormat: testUtils.generateRandomString(10),
    };

    function manyWhoMount() {
        return mount(<TableInputDateTime {...props} />);
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
});