import { str } from '../test-utils';
import * as React from 'react';
import { mount } from 'enzyme';

import Footer from '../js/components/footer';

describe('Footer component behaviour', () => {

    let componentWrapper;

    let propChildren;
    let propFlowKey;

    const globalAny:any = global;

    function manyWhoMount(children = null, isFullWidth = false) {

        propFlowKey = str(5);
        propChildren = children;

        globalAny.window.manywho.settings = {
            global: jest.fn(() => isFullWidth),
        };

        if (propChildren !== null) {
            return mount(<Footer flowKey={propFlowKey}>{propChildren}</Footer>);
        }

        return mount(<Footer flowKey={propFlowKey} />);
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Container div should not exist when there are no children', () => {
        componentWrapper = manyWhoMount(null, false);
        expect(componentWrapper.find('.mw-footer').exists()).toEqual(false);
    });

    test('Component should have container-fluid class if settings.isFullWidth is true', () => {
        componentWrapper = manyWhoMount('text child', true);
        expect(componentWrapper.find('.mw-footer').hasClass('container-fluid')).toEqual(true);
        expect(componentWrapper.find('.mw-footer').hasClass('container')).toEqual(false);
    });

    test('Component should not have container-fluid class if settings.isFullWidth is false', () => {
        componentWrapper = manyWhoMount('text child', false);
        expect(componentWrapper.find('.mw-footer').hasClass('container-fluid')).toEqual(false);
        expect(componentWrapper.find('.mw-footer').hasClass('container')).toEqual(true);
    });
});
