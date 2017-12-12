import { str } from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import InputBoolean from '../js/components/input-boolean';

describe('Boolean input component behaviour', () => {

    let booleanInputWrapper;
    let model;

    let props = {
        id: str(10),
        flowKey: str(10),
        parentId: str(5),
        value: str(5),
        disabled: false,
        readOnly: true,
        required: true,
        onChange: jest.fn(),
        autocomplete: str(5),
    };

    const globalAny:any = global;
    
    function manyWhoMount() {

        model = {
            label: str(5),
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

