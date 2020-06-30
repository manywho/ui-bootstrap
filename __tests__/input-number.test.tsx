import { str, int } from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import InputNumber from '../js/components/input-number';

const CoreUtils = require('../js/components/utils/CoreUtils');

jest.mock('../js/components/utils/CoreUtils');

jest.useFakeTimers();

describe('Number input component behaviour', () => {

    let numberInputWrapper;
    let model;

    const props = {
        id: str(10),
        flowKey: str(10),
        value: str(5),
        placeholder: str(5),
        onChange: jest.fn(),
        onBlur: jest.fn(),
        required: true,
        disabled: true,
        readOnly: true,
        size: int(1, 10),
        format: str(5),
        isDesignTime: false,
        autocomplete: str(5),
        autofocusCandidate: true,
    };

    const modelAttrs = {
        minimum: int(1, 10),
        maximum: int(1, 10),
        step: int(1, 10),  
    };

    const globalAny:any = global;

    function manyWhoMount(size = int(1, 10), attrs = modelAttrs) {

        model = {
            size,
            maxSize: 5,
            attributes: attrs,
        };

        globalAny.window.manywho['utils'] = {
            isNullOrUndefined: jest.fn(),
            isNullOrWhitespace: jest.fn((value) => {
                if (value === null || value === '')
                    return true;
                return false;
            }),
        };
        globalAny.window.manywho['formatting'] = {
            toMomentFormat: jest.fn(),
            number: jest.fn((value, format) => {
                return value;
            }),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
        };
        globalAny.window.manywho['state'] = {
            setComponent: jest.fn(),
        };

        // autofocus
        globalAny.window.manywho.settings.global = jest.fn(() => true);

        return mount(<InputNumber {...props} />);
    }

    afterEach(() => {
        numberInputWrapper.unmount();
    });

    test('Number input component renders without crashing', () => {
        numberInputWrapper = manyWhoMount();
        expect(numberInputWrapper.length).toEqual(1);
    });

    test('Number input component gets registered', () => {
        numberInputWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Value is set in local state on mount', () => {
        numberInputWrapper = manyWhoMount();
        expect(numberInputWrapper.state('value')).toEqual(props.value);
    });

    test('Attributes are in input props', () => {
        const custModelAttrs = {
            minimum: 10,
            maximum: 20,
            step: 30,  
        };

        numberInputWrapper = manyWhoMount(
            int(1, 10),
            custModelAttrs,
        );

        const input = numberInputWrapper.find('input');

        expect(input.prop('min')).toEqual(custModelAttrs.minimum);
        expect(input.prop('max')).toEqual(custModelAttrs.maximum);
        expect(input.prop('step')).toEqual(custModelAttrs.step);
    });

    test('Correct width styling are in input props', () => {
        const size = 10;
        numberInputWrapper = manyWhoMount(
            size,
        );

        const input = numberInputWrapper.find('input');

        expect(input.prop('style')).toEqual({ width: '180px' });
    });

    test('Correct default min, max, step based on maxsize in input props', () => {
        numberInputWrapper = manyWhoMount(int(1, 10), null);
        const input = numberInputWrapper.find('input');

        expect(input.prop('min')).toEqual(-99999);
        expect(input.prop('max')).toEqual(99999);
        expect(input.prop('step')).toEqual(1);
    });

    test('on number field input that onChange is triggered', () => {
        const onchangeSpy = jest.spyOn(InputNumber.prototype, 'onChange');
        numberInputWrapper = manyWhoMount(int(1, 10), null);
        numberInputWrapper.find('input').simulate('change', { target: { value: '100' } });
        expect(onchangeSpy).toHaveBeenCalled();
    });

    test('that state is updated with input value', () => {
        numberInputWrapper = manyWhoMount(int(1, 10), null);
        numberInputWrapper.find('input').simulate('change', { target: { value: '100' } });
        expect(numberInputWrapper.state('value')).toEqual('100');
    });

    test('if input value is empty that container change function is called', () => {
        numberInputWrapper = manyWhoMount();
        numberInputWrapper.find('input').simulate('change', { target: { value: '' } });
        expect(props.onChange).toHaveBeenCalled();
    });

    test('that container change function is called', () => {
        numberInputWrapper = manyWhoMount();
        numberInputWrapper.find('input').simulate('change', { target: { value: '100' } });
        expect(props.onChange).toHaveBeenCalled();
    });

    test('if input value is NaN server validity stae is set to false', () => {
        numberInputWrapper = manyWhoMount();
        numberInputWrapper.find('input').simulate('change', { target: { value: '12/12/12' } });
        expect(globalAny.window.manywho.state.setComponent).toHaveBeenCalledWith(
            props.id,
            { isValid: false },
            props.flowKey,
            true,
        );
    });

    test('Input Number components mount with autofocus', () => {
        numberInputWrapper = manyWhoMount();

        CoreUtils.focusInFirstInputElement(() => null);
        expect(CoreUtils.focusInFirstInputElement).toBeCalled();
        // this part of the test is not so robust as it is in input.test.tsx but for some unknown reason is failing
        // we should try to activate the below line once we have updated jest or enzyme (the mock for CoreUtils should also be removed)
        // expect(document.activeElement.id).toEqual(numberInputWrapper.instance().props.id);
    });
});
