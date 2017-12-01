import testUtils from '../test-utils';
import * as React from 'react';
import { mount } from 'enzyme';

import InputDateTime from '../js/components/input-datetime';

jest.mock('jquery', () => {
    return () => ({
        data: () => ({
            date: () => 'xxx',
            destroy: () => {},
        }),
        datetimepicker: () => ({
            on: () => {},
        }),
    });
});

jest.mock('../js/lib/100-datetimepicker.js', () => 'xxx');


describe('InputDateTime component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {},
        });

        globalAny.window.moment = () => ({
            utc() {
                return {
                    format() { 
                        return testUtils.generateRandomString(5);
                    },
                };
            },
        });

        const props = {
            value: testUtils.generateRandomString(5),
            placeholder: testUtils.generateRandomString(5),
            onChange: () => {},
            onBlur: () => {},
            required: false,
            disabled: false,
            readOnly: false,
            size: testUtils.generateRandomInteger(30, 200),
            format: testUtils.generateRandomString(5),
            isDesignTime: false,
            autocomplete: testUtils.generateRandomString(5),
        };

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

});
