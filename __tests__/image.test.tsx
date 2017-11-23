import testUtils from '../test-utils';

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

        propID = testUtils.generateRandomString(5);
        propparentId = testUtils.generateRandomString(5);
        propflowKey = testUtils.generateRandomString(5);

        classes = [
            testUtils.generateRandomString(5),
            testUtils.generateRandomString(5),
            testUtils.generateRandomString(5),
        ];
    
        model = {
            isVisible,
            label: testUtils.generateRandomString(5),
            imageUri: testUtils.generateRandomString(5),
            developerName: testUtils.generateRandomString(5),
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
        expect(imageWrapper.find('.img-responsive').prop('src')).toEqual(model.imageUri);
    });

    test('Image alt attribute is equal to model developerName property', () => {
        imageWrapper = manyWhoMount();
        expect(imageWrapper.find('.img-responsive').prop('alt')).toEqual(model.developerName);
    });
});
