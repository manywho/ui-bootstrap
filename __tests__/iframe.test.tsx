import { str } from '../test-utils';

import * as React from 'react';
import { mount } from 'enzyme';

import IFrame from '../js/components/iframe';

describe('Iframe component behaviour', () => {

    let iframeWrapper;
    let classes;
    let model;
    let propID;
    let propparentId;
    let propflowKey;

    const globalAny:any = global;

    function manyWhoMount() {

        propID = str(5);
        propparentId = str(5);
        propflowKey = str(5);

        classes = [
            str(5),
            str(5),
            str(5),
        ];
    
        model = {
            height: str(2),
            width: str(2),
            imageUri: str(20),
        };

        globalAny.window.manywho['styling'] = {
            getClasses: jest.fn(() => classes),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
            getOutcomes: jest.fn(() => []),
        };

        return mount(<IFrame id={propID} flowKey={propflowKey} parentId={propparentId} />);
    }

    afterEach(() => {
        iframeWrapper.unmount();
    });

    test('iframe component renders without crashing', () => {
        iframeWrapper = manyWhoMount();
        expect(iframeWrapper.length).toEqual(1);
    });

    test('iframe props are set', () => {
        iframeWrapper = manyWhoMount();
        expect(iframeWrapper.props().id).toEqual(propID);
        expect(iframeWrapper.props().parentId).toEqual(propparentId);
        expect(iframeWrapper.props().flowKey).toEqual(propflowKey);
    });

    test('Component gets registered', () => {
        iframeWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Component should have manywho classes', () => {
        iframeWrapper = manyWhoMount();
        const iFrameDiv = iframeWrapper.find('.' + classes[0]);
        expect([classes[0], classes[1], classes[2]].every(cssClass => iFrameDiv.hasClass(cssClass))).toEqual(true);
    });

    test('iframe element src should equal model imageUri', () => {
        iframeWrapper = manyWhoMount();
        expect(iframeWrapper.find('iframe').prop('src')).toEqual(model.imageUri);
    });

    test('iframe element width should equal model width', () => {
        iframeWrapper = manyWhoMount();
        expect(iframeWrapper.find('iframe').prop('width')).toEqual(model.width);
    });

    test('iframe element height should equal model height', () => {
        iframeWrapper = manyWhoMount();
        expect(iframeWrapper.find('iframe').prop('height')).toEqual(model.height);
    });
});
