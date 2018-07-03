import * as React from 'react';
import { shallow } from 'enzyme';
import { noop, str } from '../test-utils';

import ItemsHeader from '../js/components/items-header';
import Outcome from '../js/components/outcome';

describe('ItemsHeader component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        {
            isSearchable = false,
            isRefreshable = true,
            outcomes = [],
            onSearch = noop,
            refresh = noop,
        } = {},
    ) {

        const props = {
            isSearchable,
            onSearch,
            outcomes,
            refresh,
            isRefreshable,
        };

        return shallow(<ItemsHeader {...props} />);
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
        .toHaveBeenCalledWith('mw-items-header', ItemsHeader); 
    });

    test('Component renders search when isSearchable is true', () => {
        componentWrapper = manyWhoMount({
            isSearchable: true,
        });

        expect(
            componentWrapper.find('.mw-items-header-search').exists(),
        ).toEqual(true);
    });

    test('Clicking search button calls props.onSearch', () => {
        const onSearch = jest.fn();

        componentWrapper = manyWhoMount({
            onSearch,
            isSearchable: true,
        });

        componentWrapper.find('.mw-items-header-search .btn-default').simulate('click');

        expect(onSearch).toBeCalled();
    });

    test('Search is not rendered when props.onSearch is false', () => {

        componentWrapper = manyWhoMount({
            isSearchable: false,
        });

        expect(componentWrapper.find('.mw-items-header-search').length).toBe(0);
    });

    test('Outcome section is not rendered when props.outcomes is null', () => {

        componentWrapper = manyWhoMount({
            outcomes: null,
        });

        expect(componentWrapper.find('.mw-items-header-outcomes').length).toBe(0);
    });

    test('Pressing enter calls props.onSearch', () => {
        const onSearch = jest.fn();
        const event = {
            keyCode: 13,
            stopPropagation: noop,
        };

        componentWrapper = manyWhoMount({
            onSearch,
            isSearchable: true,
        });

        componentWrapper.find('.mw-items-header-search .form-control').first().simulate('keyup', event);

        expect(onSearch).toBeCalled();
    });

    test('Pressing non-enter keys in search does not call props.onSearch', () => {
        const onSearch = jest.fn();
        const event = {
            keyCode: 1,
            stopPropagation: noop,
        };

        componentWrapper = manyWhoMount({
            onSearch,
            isSearchable: true,
        });

        componentWrapper.find('.mw-items-header-search .form-control').first().simulate('keyup', event);

        expect(onSearch).not.toBeCalled();
    });

    test('Changing search input value calls setState with new value', () => {
        const setStateSpy = jest.spyOn(ItemsHeader.prototype, 'setState');
        const newSearchText = str();

        const event = {
            currentTarget: {
                value: newSearchText,
            },
        };

        componentWrapper = manyWhoMount({
            isSearchable: true,
        });

        componentWrapper.find('.mw-items-header-search .form-control').first().simulate('change', event);

        expect(setStateSpy).toBeCalledWith(expect.objectContaining({
            search: newSearchText,
        }));
    });

    test('Clicking refresh button calls props.refresh', () => {
        const refresh = jest.fn();

        componentWrapper = manyWhoMount({
            refresh,
        });

        componentWrapper.find('.btn-sm.btn-default').simulate('click');

        expect(refresh).toBeCalled();
    });

    test('If isRefreshable is falsey then no refresh button is displayed', () => {
        let isRefreshable = null;

        componentWrapper = manyWhoMount({
            isRefreshable,
        });

        expect(componentWrapper.find('.btn-sm.btn-default').exists()).toBeFalsy();

        componentWrapper.unmount();

        isRefreshable = false;
    
        componentWrapper = manyWhoMount({
            isRefreshable,
        });

        expect(componentWrapper.find('.btn-sm.btn-default').exists()).toBeFalsy();
    });

    test('Component renders bulk outcomes only', () => {
        componentWrapper = manyWhoMount({
            outcomes:[
                { isBulkAction: true, id: 1 },
                { isBulkAction: false, id: 2 },
                { isBulkAction: true, id: 3 },
            ],
        });

        expect(componentWrapper.find(Outcome).length).toEqual(2);
    });


});
