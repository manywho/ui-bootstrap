import { str } from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import * as MaskedInput from 'react-maskedinput';

import getInputBoolean from '../js/components/input-boolean';
import getInputDateTime from '../js/components/input-datetime';
import getInputNumber from '../js/components/input-number';
import Input from '../js/components/input';

describe('Input component behaviour', () => {

    let inputWrapper;
    let classes;
    let model;
    let contentTypes;
    let propID;
    let propparentId;
    let propflowKey;

    const globalAny:any = global;

    function manyWhoMount(modelcontentType = 'ContentString', mask = null, isVisible = false, isNullOrWhitespace = null) {

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
                type: str(5),
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
        };

        return mount(<Input id={propID} parentId={propparentId} flowKey={propflowKey} />);
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
        expect(inputWrapper.find(getInputDateTime).exists()).toEqual(true);
    });

    test('Boolean input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentBoolean');
        expect(inputWrapper.find(getInputBoolean).exists()).toEqual(true);
    });

    test('Number input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentNumber');
        expect(inputWrapper.find(getInputNumber).exists()).toEqual(true);
    });

    test('Password input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentPassword');
        expect(inputWrapper.find('input').prop('type')).toEqual('password');
    });

    test('MaskedInput input gets rendered', () => {
        inputWrapper = manyWhoMount('ContentString', '11:11');
        expect(inputWrapper.find(MaskedInput).exists()).toEqual(true);
    });

    test('on text input that onChange is triggered', () => {
        const onchangeSpy = jest.spyOn(Input.prototype, 'onChange');
        inputWrapper = manyWhoMount();
        inputWrapper.find('input').simulate('change', { target: { value: 'text' } });
        expect(onchangeSpy).toHaveBeenCalled();
        expect(globalAny.window.manywho.state.getComponent).toHaveBeenCalled();
        expect(globalAny.window.manywho.validation.validate).toHaveBeenCalled();
        expect(globalAny.window.manywho.state.setComponent).toHaveBeenCalledTimes(2);
    });

    test('on input blur that onBlur is triggered', () => {
        const onblurSpy = jest.spyOn(Input.prototype, 'onBlur');
        inputWrapper = manyWhoMount();
        inputWrapper.find('input').simulate('blur');
        expect(onblurSpy).toHaveBeenCalled();
        expect(globalAny.window.manywho.component.handleEvent).toHaveBeenCalled();
    });

});
