import { str } from '../test-utils';

import * as React from 'react';
import { mount } from 'enzyme';

import Image from '../js/components/image';

describe('Image component behaviour', () => {

    let imageWrapper;
    let classes;
    let model;
    let propID;
    let propparentId;
    let propflowKey;

    const globalAny:any = global;

    function manyWhoMount(isVisible = false, isNullOrWhitespace = null) {

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
            imageUri: str(5),
            developerName: str(5),
            width: '200',
            height: '200',
        };

        globalAny.window.manywho['styling'] = {
            getClasses: jest.fn(() => classes),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
            getOutcomes: jest.fn(() => []),
        },
        globalAny.window.manywho['utils'] = {
            isNullOrWhitespace: jest.fn(() => isNullOrWhitespace),
        };

        return mount(<Image id={propID} parentId={propparentId} flowKey={propflowKey} />);
    }

    afterEach(() => {
        imageWrapper.unmount();
    });

    test('Image component renders without crashing', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.length).toEqual(1);
    });

    test('Image props are set', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.props().id).toEqual(propID);
        expect(imageWrapper.props().parentId).toEqual(propparentId);
        expect(imageWrapper.props().flowKey).toEqual(propflowKey);
    });

    test('Component gets registered', () => {
        imageWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Image component should have hidden class', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.' + classes[0]).hasClass('hidden')).toEqual(true);
    });

    test('Image component should not have hidden class if model.isVisible is true', () => {
        imageWrapper = manyWhoMount(true);
        expect(imageWrapper.find('.' + classes[0]).hasClass('hidden')).toEqual(false);
    });

    test('Label is equal to model label property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-label').text()).toEqual(model.label);
    });

    test('Label element should not exist if model.label is blank', () => {
        imageWrapper = manyWhoMount(false, true);
        expect(imageWrapper.find('.img-label').exists()).toEqual(false);
    });

    test('Image src attribute is equal to model imageUri property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-custom').prop('src')).toEqual(model.imageUri);
    });

    test('Image alt attribute is equal to model developerName property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-custom').prop('alt')).toEqual(model.developerName);
    });

    test('Image width attribute is equal to model width property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-custom').prop('width')).toEqual(model.width);
    });

    test('Image height attribute is equal to model height property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-custom').prop('height')).toEqual(model.height);
    });
});
