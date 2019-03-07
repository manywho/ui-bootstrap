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

        const test = shallow(componentWrapper.instance().getHeaderElement('1', { label: null }));
        expect(test.find('.navbar-toggle.collapsed').exists()).toBe(true);
        expect(test.find('.icon-bar').exists()).toBe(true);
        expect(test.find('.navbar-brand').exists()).toBe(false);
    });

    test('GetHeaderElement renders collapse button and label brand when given a label', () => {

        componentWrapper = manyWhoMount();

        const test = shallow(componentWrapper.instance().getHeaderElement('1', { label: 'label' }));
        expect(test.find('.navbar-toggle.collapsed').exists()).toBe(true);
        expect(test.find('.icon-bar').exists()).toBe(true);
        expect(test.find('.navbar-brand').exists()).toBe(true);
    });

    test('GetNavElements renders nothing given no items', () => {

        componentWrapper = manyWhoMount();

        const items = [];

        const test = componentWrapper.instance().getNavElements(items, true);
        expect(test.length).toBe(0);
    });

    test('GetNavElements renders single top level item', () => {

        componentWrapper = manyWhoMount();

        const items = [
            {
                isCurrent: true,
                isVisible: true,
                isEnabled: true,
            },
        ];

        const test = shallow(componentWrapper.instance().getNavElements(items, true)[0]);
        expect(test.find('.active').exists()).toBe(true);
        expect(test.find('.hidden').exists()).toBe(false);
        expect(test.find('.disabled').exists()).toBe(false);
        expect(test.find('.top-nav-element').exists()).toBe(true);
        expect(test.find('.dropdown-submenu').exists()).toBe(false);
        expect(test.find('.dropdown-toggle').exists()).toBe(false);
        expect(test.find('.dropdown-menu').exists()).toBe(false);
        expect(test.find('.caret').exists()).toBe(false);
    });

    test('GetNavElements renders multiple top level items, one with a child item', () => {

        componentWrapper = manyWhoMount();

        const items = [
            {
                isCurrent: true,
                isVisible: true,
                isEnabled: true,
            },
            {
                isCurrent: true,
                isVisible: true,
                isEnabled: true,
                items: [{
                    isCurrent: true,
                    isVisible: true,
                    isEnabled: true,
                }],
            },
        ];

        const test = shallow(componentWrapper.instance().getNavElements(items, true)[1]);
        expect(test.find('.active').length).toBe(2);
        expect(test.find('.hidden').exists()).toBe(false);
        expect(test.find('.disabled').exists()).toBe(false);
        expect(test.find('.top-nav-element').length).toBe(1);
        expect(test.find('.dropdown-submenu').length).toBe(0);
        expect(test.find('.dropdown-toggle').length).toBe(1);
        expect(test.find('.dropdown-menu').length).toBe(1);
        expect(test.find('.caret').length).toBe(1);
    });

    test('GetNavElements renders multiple top level items, one with a child item which has a child item', () => {

        componentWrapper = manyWhoMount();

        const items = [{
            isCurrent: true,
            isVisible: true,
            isEnabled: true,
        }, {
            isCurrent: true,
            isVisible: true,
            isEnabled: true,
            items: [{
                isCurrent: true,
                isVisible: true,
                isEnabled: true,
                items: [{
                    isCurrent: true,
                    isVisible: true,
                    isEnabled: true,
                }],
            }],
        }];

        const test = shallow(componentWrapper.instance().getNavElements(items, true)[1]);
        expect(test.find('.active').length).toBe(3);
        expect(test.find('.hidden').exists()).toBe(false);
        expect(test.find('.disabled').exists()).toBe(false);
        expect(test.find('.top-nav-element').length).toBe(1);
        // This is true only in this case, where there is a unique type of nested horizontal navigation
        expect(test.find('.dropdown-submenu').length).toBe(1);
        // There are now two expandable drop down menus, one vertical, one horizontal
        expect(test.find('.dropdown-toggle').length).toBe(2);
        expect(test.find('.dropdown-menu').length).toBe(2);
        expect(test.find('.caret').length).toBe(2);
    });

    test('onClick does nothing if the item is disabled', () => {

        componentWrapper = manyWhoMount();

        const result = componentWrapper.instance().onClick({ isEnabled: false, id: '1' });
        expect(result).toBe(false);
    });
    
});
