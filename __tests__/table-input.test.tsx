import { f, str } from '../test-utils';

import * as React from 'react';

import { shallow } from 'enzyme';

import TableInput from '../js/components/table-input';



describe('Table input component behaviour', () => {

    let tableInputWrapper;
    let val:any;
    val = str();

    const globalAny:any = global;

    function manyWhoMount(
        {
            contentType = 'string',
            value = val,
        } = {},
    ) {

        const props = {
            value,
            contentType,
            id: 'string',
            parentId: 'string',
            flowKey: 'string',
            contentFormat: 'string',
            propertyId: 'string',
            onCommitted: jest.fn(),
        };

        globalAny.window.manywho.component['contentTypes'] = {
            boolean: 'CONTENTBOOLEAN',
            content: 'CONTENTCONTENT',
            datetime: 'CONTENTDATETIME',
            list: 'CONTENTLIST',
            number: 'CONTENTNUMBER',
            object: 'CONTENTOBJECT',
            password: 'CONTENTPASSWORD',
            string: 'CONTENTSTRING',
        };
        return shallow(<TableInput {...props} />);
    }

    afterEach(() => {
        tableInputWrapper.unmount();
    });

    test('Table input component renders without crashing', () => {
        tableInputWrapper = manyWhoMount();
        expect(tableInputWrapper.length).toEqual(1);
    });

    test('Table input component gets registered', () => {
        tableInputWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('isEmptyDate identifies 01/01/0001 as empty date string', () => {
        tableInputWrapper = manyWhoMount();
        const date = '01/01/0001';

        expect(TableInput.prototype.isEmptyDate(date)).toBe(true);
    });

    test('isEmptyDate identifies 1/1/0001 as empty date string', () => {
        tableInputWrapper = manyWhoMount();
        const date = '1/1/0001';

        expect(TableInput.prototype.isEmptyDate(date)).toBe(true);
    });

    test('isEmptyDate identifies 0001-01-01 as empty date string', () => {
        tableInputWrapper = manyWhoMount();
        const date = '0001-01-01';

        expect(TableInput.prototype.isEmptyDate(date)).toBe(true);
    });

    test('isEmptyDate identifies null date', () => {
        tableInputWrapper = manyWhoMount();
        const date = null;

        expect(TableInput.prototype.isEmptyDate(date)).toBe(true);
    });
    
    test('isEmptyDate identifies valid date', () => {
        tableInputWrapper = manyWhoMount();
        const date = Date();

        expect(TableInput.prototype.isEmptyDate(date)).toBe(false);
    });
    
    test('getInputType returns the correct type for CONTENTSTRING', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTSTRING')).toBe('text');
    });
    
    test('getInputType returns the correct type for CONTENTPASSWORD', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTPASSWORD')).toBe('password');
    });
    
    test('getInputType returns the correct type for CONTENTOBJECT', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTOBJECT')).toBe('text');
    });
    
    test('getInputType returns the correct type for CONTENTNUMBER', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTNUMBER')).toBe('number');
    });
    
    test('getInputType returns the correct type for CONTENTLIST', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTLIST')).toBe('text');
    });
    
    test('getInputType returns the correct type for CONTENTDATETIME', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTDATETIME')).toBe('datetime');
    });
    
    test('getInputType returns the correct type for CONTENTCONTENT', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTCONTENT')).toBe('text');
    });
    
    test('getInputType returns the correct type for CONTENTBOOLEAN', () => {
        tableInputWrapper = manyWhoMount();
        
        expect(TableInput.prototype.getInputType('CONTENTBOOLEAN')).toBe('checkbox');
    });
    
    test('change event on boolean input toggles value between true and false', () => {
        const setStateSpy = jest.spyOn(TableInput.prototype, 'setState');
        
        globalAny.window.manywho.utils.isEqual = x => x === 'CONTENTBOOLEAN';

        tableInputWrapper = manyWhoMount({
            contentType: 'CONTENTBOOLEAN',
            value: false,
        });

        tableInputWrapper.simulate('change');
        
        expect(setStateSpy).toHaveBeenLastCalledWith(expect.objectContaining({
            value: true,
        }));
    });
    
    test('change event on text input sets value on state', () => {
        const setStateSpy = jest.spyOn(TableInput.prototype, 'setState');
        const value1 = str();
        const value2 = str();

        const myEvent = {
            currentTarget: {
                value: value2,
            },
        };

        globalAny.window.manywho.utils.isEqual = f;

        tableInputWrapper = manyWhoMount({
            contentType: 'CONTENTSTRING',
            value: value1,
        });

        tableInputWrapper.simulate('change', myEvent);
        
        expect(setStateSpy).toHaveBeenLastCalledWith(expect.objectContaining({
            value: value2,
        }));
    });
    
    test('Pressing enter on input calls onCommit', () => {
        const setStateSpy = jest.spyOn(TableInput.prototype, 'setState');
        const value1 = str();
        const value2 = str();

        const myEvent = {
            currentTarget: {
                value: value2,
            },
        };

        globalAny.window.manywho.utils.isEqual = f;

        tableInputWrapper = manyWhoMount({
            contentType: 'CONTENTSTRING',
            value: value1,
        });

        tableInputWrapper.simulate('change', myEvent);
        
        expect(setStateSpy).toHaveBeenLastCalledWith(expect.objectContaining({
            value: value2,
        }));
    });
    
    test('Focussing on input sets isFocused on state to true', () => {
        const setStateSpy = jest.spyOn(TableInput.prototype, 'setState');

        tableInputWrapper = manyWhoMount();

        tableInputWrapper.simulate('focus');
        
        expect(setStateSpy).toHaveBeenLastCalledWith(expect.objectContaining({
            isFocused: true,
        }));
    });
    
    test('Blurring focus on input sets isFocused on state to false', () => {
        const setStateSpy = jest.spyOn(TableInput.prototype, 'setState');

        tableInputWrapper = manyWhoMount();

        tableInputWrapper.simulate('blur');
        
        expect(setStateSpy).toHaveBeenLastCalledWith(expect.objectContaining({
            isFocused: false,
        }));
    });

    test('input value is set to props.value', () => {
        const value1 = str();

        tableInputWrapper = manyWhoMount({
            contentType: 'CONTENTSTRING',
            value: value1,
        });

        expect(tableInputWrapper.find('input').first().props().value).toBe(value1);
    });
});
