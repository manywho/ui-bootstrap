import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import Table from '../js/components/table-container';

describe('Table component behaviour', () => {

    let tableWrapper;
    let props;
    let model;

    const globalAny:any = global;

    function manyWhoMount(isVisible = true, isValid = true) {

        props = {
            id: 'string',
            parentId: 'string',
            flowKey: 'string',
            items: [],
            isDesignTime: false,
            children: false,
            sort: jest.fn(),
            select: jest.fn(),
            objectData: 'string',
            sortedBy: 'string',
            sortedIsAscending: true,
            onOutcome: jest.fn(),
            selectAll: jest.fn(),
            contentElement: null,
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
    
        model = {
            isVisible,
            isValid,
            fileDataRequest: {},
        };

        globalAny.window.manywho['utils'] = {
            debounce: jest.fn(),
            isEqual: jest.fn(),
            isNullOrWhitespace: jest.fn(),
            extend: jest.fn((props) => {
                return props;
            }),
        };
        globalAny.window.manywho.model.getOutcomes = jest.fn(() => {
            return [];
        });
        globalAny.window.manywho.model.getComponent = jest.fn(() => {
            return model;
        });
        globalAny.window.manywho.component.getByName = jest.fn((component, props) => {
            return 'div';
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
        expect(globalAny.window.manywho.component.registerItems).toHaveBeenCalledTimes(2);
    });

    test('Table Large gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-table-large');
    });

    test('Table Small gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        tableWrapper.setState({ windowWidth: testUtils.generateRandomInteger(100, 500) });
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-table-small');
    });

    test('if window inner width is less than 768px then small tables class gets applied to rendered markup', () => {
        tableWrapper = manyWhoMount();
        tableWrapper.setState({ windowWidth: testUtils.generateRandomInteger(100, 500) });
        expect(tableWrapper.find('.table-container-small').exists()).toEqual(true);
    });

    test('File Upload gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('file-upload');
    });

    test('Items Header gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-items-header');
    });

    test('Pagination gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-pagination');
    });

    test('Loader gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('wait');
    });

    test('hidden class gets applied to rendered markup', () => {
        tableWrapper = manyWhoMount(true);
        expect(tableWrapper.find('.hidden').exists()).toEqual(true);
        tableWrapper.setState({ isVisible: false });
        expect(tableWrapper.find('.clearfix').hasClass('hidden')).toEqual(true);
    });

    test('help block gets rendered', () => {
        tableWrapper = manyWhoMount(true, false);
        expect(tableWrapper.find('.has-error').exists()).toEqual(true);
    });
});
