import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import Table from '../js/components/table-container';

describe('Table component behaviour', () => {

    let tableWrapper;
    const globalAny:any = global;
    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        items: [],
        isDesignTime: true,
        children: false,
        sort: jest.fn(),
        select: jest.fn(),
        objectData: 'string',
        sortedBy: 'string',
        sortedIsAscending: true,
        onOutcome: jest.fn(),
        selectAll: jest.fn(),
        contentElement: 'string',
        isLoading: true,
        onSearch: jest.fn(),
        refresh: jest.fn(),
        page: 10,
        onFirstPage: jest.fn(),
        pageIndex: 10,
        onPrev: jest.fn(),
        onNext: jest.fn(),
        hasMoreResults: true,
    };

    function manyWhoMount() {
        globalAny.window.manywho['utils'] = {
            debounce: jest.fn(),
            isEqual: jest.fn(),
            isNullOrWhitespace: jest.fn(),
        };
        globalAny.window.manywho.model.getOutcomes = jest.fn(() => {
            return [];
        });
        return mount(<Table {...props} />);
    }

    afterEach(() => {
        tableWrapper.unmount();
    });

    test('Table component renders without crashing', () => {
        tableWrapper = manyWhoMount();
        expect(tableWrapper.length).toEqual(1);
    });

    test('Table component gets registered', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
