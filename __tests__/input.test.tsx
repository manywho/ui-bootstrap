import { str } from '../test-utils';

import * as React from 'react';

import { mount, shallow } from 'enzyme';

import InputBoolean from '../js/components/input-boolean';
import InputDateTime from '../js/components/input-datetime';
import InputNumber from '../js/components/input-number';
import Input from '../js/components/input';

// react-maskedinput v4.0.1 has messed up default exports
// https://github.com/insin/react-maskedinput/issues/104
let MaskedInput = require('react-maskedinput');
if (MaskedInput.default) {
    MaskedInput = MaskedInput.default;
}

describe('Input component behaviour', () => {

    let inputWrapper;
    let classes;
    let model;
    let contentTypes;
    let propID;
    let propparentId;
    let propflowKey;

    const globalAny:any = global;

    function manyWhoMount(modelcontentType = 'ContentString', mask = null, isVisible = false,
        isNullOrWhitespace = null, shallowRender = false, autocomplete = null) {

        propID = str(5);
        propparentId = str(5);
        propflowKey = str(5);

        classes = [
            str(5),
            str(5),
            str(5),
        ];

        model = {
            isVisible,
            label: str(5),
            contentType: modelcontentType,
            developerName: str(5),
            attributes: {
                mask,
                type: 'text',
                autocomplete,
            },
        };

        contentTypes = {
            boolean: 'CONTENTBOOLEAN',
            content: 'CONTENTCONTENT',
            datetime: 'CONTENTDATETIME',
            list: 'CONTENTLIST',
            number: 'CONTENTNUMBER',
            object: 'CONTENTOBJECT',
            password: 'CONTENTPASSWORD',
            string: 'CONTENTSTRING',
        };

        globalAny.window.manywho['validation'] = {
            validate: jest.fn(),
        };
        globalAny.window.manywho['styling'] = {
            getClasses: jest.fn(() => classes),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
            getOutcomes: jest.fn(() => []),
        },
        globalAny.window.manywho['state'] = {
            getComponent: jest.fn(),
            setComponent: jest.fn(),
        },
        globalAny.window.manywho['formatting'] = {
            toMomentFormat: jest.fn(),
            number: jest.fn(),
        },
        globalAny.window.manywho.component['contentTypes'] = contentTypes,
        globalAny.window.manywho.component['handleEvent'] = jest.fn(),
        globalAny.window.manywho['utils'] = {
            isNullOrWhitespace: jest.fn(() => isNullOrWhitespace),
            isNullOrUndefined: jest.fn(),
            isNullOrEmpty: jest.fn((arg) => {
                if (arg === null || arg === []) {
                    return true;
                }
                return false;
            }),
            isEqual: jest.fn(_ => true),
        };

        return shallowRender
            ? shallow(<Input id={propID} parentId={propparentId} flowKey={propflowKey} />)
            : mount(<Input id={propID} parentId={propparentId} flowKey={propflowKey} />);
    }

    afterEach(() => {
        inputWrapper.unmount();
    });

    test('Input component renders without crashing', () => {
        inputWrapper = manyWhoMount();
        expect(inputWrapper.length).toEqual(1);
    });

    test('Input props are set', () => {
        inputWrapper = manyWhoMount();
        expect(inputWrapper.props().id).toEqual(propID);
        expect(inputWrapper.props().parentId).toEqual(propparentId);
        expect(inputWrapper.props().flowKey).toEqual(propflowKey);
    });

    test('Component gets registered', () => {
        inputWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Default input gets rendered', () => {
        inputWrapper = manyWhoMount();
        expect(inputWrapper.find('input').exists()).toEqual(true);
        expect(inputWrapper.find('input').prop('type')).toEqual(model.attributes.type);
    });

    test('Datetime input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentDateTime');
        expect(inputWrapper.find(InputDateTime).exists()).toEqual(true);
    });

    test('Boolean input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentBoolean');
        expect(inputWrapper.find(InputBoolean).exists()).toEqual(true);
    });

    test('Number input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentNumber');
        expect(inputWrapper.find(InputNumber).exists()).toEqual(true);
    });

    test('Visible Password input gets rendered as password type', () => {
        inputWrapper = manyWhoMount('ContentPassword', null, true);
        expect(inputWrapper.find('input').prop('type')).toEqual('password');
    });

    test('Invisible Password input gets rendered as hidden type', () => {
        inputWrapper = manyWhoMount('ContentPassword', null, false);
        expect(inputWrapper.find('input').prop('type')).toEqual('hidden');
    });

    test('Password input set as autocomplete="new-password" by default', () => {
        const isnullorwhitespace = (value: string): boolean => {
            if (typeof value === 'undefined' || value === null) {
                return true;
            }
            return value.replace(/\s/g, '').length < 1;
        };
        inputWrapper = manyWhoMount('ContentPassword', null, true, isnullorwhitespace);
        expect(inputWrapper.find('input').prop('autoComplete')).toEqual('new-password');
    });

    test('Can override Password input autocomplete', () => {
        inputWrapper = manyWhoMount('ContentPassword', null, true, null, true, 'override');
        expect(inputWrapper.find('input').prop('autoComplete')).toEqual('override');
    });

    test('MaskedInput input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentString', '11:11', true, undefined, true);
        expect(inputWrapper.find(MaskedInput).exists()).toEqual(true);
    });

    test('on text input that onChange is triggered', () => {
        const onchangeSpy = jest.spyOn(Input.prototype, 'onChange');
        inputWrapper = manyWhoMount();
        inputWrapper.find('input').simulate('change', { target: { value: 'text' } });
        expect(onchangeSpy).toHaveBeenCalled();
        expect(globalAny.window.manywho.state.getComponent).toHaveBeenCalled();
        expect(globalAny.window.manywho.state.setComponent).toHaveBeenCalledTimes(1);
    });

    test('on input blur that onBlur is triggered', () => {
        const onblurSpy = jest.spyOn(Input.prototype, 'onBlur');
        inputWrapper = manyWhoMount();
        inputWrapper.find('input').simulate('blur');
        expect(onblurSpy).toHaveBeenCalled();
        expect(globalAny.window.manywho.component.handleEvent).toHaveBeenCalled();
    });

});
