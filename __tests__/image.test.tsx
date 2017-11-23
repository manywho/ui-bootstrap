import testUtils from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Image from '../js/components/image';

describe('Image component behaviour', () => {

    let imageWrapper;
    const globalAny:any = global;

    const classes = [
        testUtils.generateRandomString(5),
        testUtils.generateRandomString(5),
        testUtils.generateRandomString(5),
    ];

    const model = {
        label: testUtils.generateRandomString(5),
        isVisible: false,
        imageUri: testUtils.generateRandomString(5),
        developerName: testUtils.generateRandomString(5),
    };

    beforeEach(() => {
        globalAny.manywho = {
            styling: {
                getClasses: jest.fn(() => classes),
            },
            model: {
                getComponent: jest.fn(() => model),
                getOutcomes: jest.fn(() => []),
            },
            utils: {
                isNullOrWhitespace: jest.fn(() => true),
            },
        };
        imageWrapper = shallow(<Image id="test" parentId="2" flowKey="3" />);
    });

    test('Image component renders without crashing', () => {
        expect(imageWrapper.length).toEqual(1);
    });

    test('Image component should have hidden class', () => {
        expect(imageWrapper.find('.' + classes[0]).hasClass('hidden')).toEqual(true);
    });

    test('Label is equal to model label property', () => {
        expect(imageWrapper.find('.img-label').text()).toEqual(model.label);
    });

    test('Image src attribute is equal to model imageUri property', () => {
        expect(imageWrapper.find('.img-responsive').prop('src')).toEqual(model.imageUri);
    });

    test('Image alt attribute is equal to model developerName property', () => {
        expect(imageWrapper.find('.img-responsive').prop('alt')).toEqual(model.developerName);
    });
});
