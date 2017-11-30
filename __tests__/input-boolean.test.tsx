import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import InputBoolean from '../js/components/input-boolean';

describe('Boolean input component behaviour', () => {

    let booleanInputWrapper;
    let model;

    let props = {
        id: testUtils.generateRandomString(10),
        flowKey: testUtils.generateRandomString(10),
        parentId: testUtils.generateRandomString(5),
        value: testUtils.generateRandomString(5),
        disabled: false,
        readOnly: true,
        required: true,
        onChange: jest.fn(),
        autocomplete: testUtils.generateRandomString(5),
    };

    const globalAny:any = global;
    
    function manyWhoMount() {

        model = {
            label: testUtils.generateRandomString(5),
        };

        globalAny.window.manywho['utils'] = {
            isEqual: jest.fn(() => {
                return true;
            }),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
        };
        return mount(<InputBoolean { ...props } />);
    }
    
    afterEach(() => {
        booleanInputWrapper.unmount();
    });
    
    test('Boolean input component renders without crashing', () => {
        booleanInputWrapper = manyWhoMount();
        expect(booleanInputWrapper.length).toEqual(1);
    });

    test('Boolean input component gets registered', () => {
        booleanInputWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

});

