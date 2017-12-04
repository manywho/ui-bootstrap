import * as React from 'react';
import { shallow } from 'enzyme';
import { noop } from '../test-utils';

import ItemsHeader from '../js/components/items-header';
import Outcome from '../js/components/outcome';

describe('ItemsHeader component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        {
            isSearchable = false,
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

    test('Component renders search when required', () => {
        componentWrapper = manyWhoMount({
            isSearchable: true,
        });

        expect(
            componentWrapper.find('.mw-items-header-search').length,
        ).toEqual(1);
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

    test('Clicking refresh button calls props.refresh', () => {
        const refresh = jest.fn();

        componentWrapper = manyWhoMount({
            refresh,
        });

        componentWrapper.find('.btn-sm.btn-default').simulate('click');

        expect(refresh).toBeCalled();
    });

    test('Component renders bulk outcomes only', () => {
        componentWrapper = manyWhoMount({
            outcomes:[
                { isBulkAction: true },
                { isBulkAction: false },
                { isBulkAction: true },
            ],
        });

        expect(componentWrapper.find(Outcome).length).toEqual(2);
    });

});
