import * as React from 'react';
import { shallow } from 'enzyme';

import Navigation from '../js/components/navigation';

describe('Navigation component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        const props = {
            id: '1234-2134',
            isFullWidth: false,
            isFixed: false,
        };

        return shallow(<Navigation {...props} />);
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
        expect(globalAny.window.manywho.component.register)
        .toHaveBeenCalledWith('navigation', Navigation); 
    });

    test('GetItem top level search success test', () => {
        componentWrapper = manyWhoMount();
        const items = {
            "123" : 0,
            "456" : 1,
            "789" : 2,
        };
        expect(componentWrapper.instance().getItem(items, "123")).toBe(0);
        expect(componentWrapper.instance().getItem(items, "456")).toBe(1);
        expect(componentWrapper.instance().getItem(items, "789")).toBe(2);
    });

    test('GetItem lower level search success test', () => {
        componentWrapper = manyWhoMount();
        const items = {
            "123" : 0,
            "456" : {
                items: {
                    "012" : 1,
                }
            },
            "789" : 2,
        };
        expect(componentWrapper.instance().getItem(items, "012")).toBe(1);
    });

    test('GetItem search fail test', () => {
        componentWrapper = manyWhoMount();
        const items = {
            "123" : 0,
            "456" : {
                items: {
                    "012" : 1,
                }
            },
            "789" : 2,
        };
        expect(componentWrapper.instance().getItem(items, "1234")).toBeFalsy();
    });

    test('GetHeaderElement renders collapse button by default', () => {

        componentWrapper = manyWhoMount();

        const test = shallow(componentWrapper.instance().getHeaderElement('1', { label: null; }));
        expect(test.exists('.navbar-toggle collapsed')).toBeTruthy();
        expect(test.exists('.icon-bar')).toBeTruthy();
        expect(test.find('.navbar-brand').exists()).toBe(false);
    });

    test('GetHeaderElement renders collapse button and label brand when given a label', () => {

        componentWrapper = manyWhoMount();

        const test = shallow(componentWrapper.instance().getHeaderElement('1', { label: 'label'; }));
        const text = test.html();
        expect(test.exists('.navbar-toggle collapsed')).toBeTruthy();
        expect(test.exists('.icon-bar')).toBeTruthy();
        expect(test.find('.navbar-brand').exists()).toBe(true);
    });

});
