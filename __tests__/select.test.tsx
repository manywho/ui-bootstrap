import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import Select from '../js/components/select';

const globalAny:any = global;

globalAny.reactSelectize = {
    SimpleSelect: React.createClass({
        render: () => {
            return <div></div>;
        },
    },
});

describe('Select input component behaviour', () => {

    let selectWrapper;

    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        isDesignTime: true,
        contentElement: <div></div>,
        hasMoreResults: true,
        onOutcome: jest.fn(),
        select: jest.fn(),
        selectAll: jest.fn(),
        clearSelection: jest.fn(),
        objectData: [],
        onSearch: jest.fn(),
        outcomes: [],
        refresh: jest.fn(),
        onNext: jest.fn(),
        onPrev: jest.fn(),
        onFirstPage: jest.fn(),
        page: 10,
        limit: 10,
        isLoading: false,
        sort: jest.fn(),
        sortedBy: false,
        sortedIsAscending: 'string',
    };

    function manyWhoMount() {
        globalAny.window.manywho['utils'] = {
            debounce: jest.fn(),
        };
        return mount(<Select {...props} />);
    }

    afterEach(() => {
        selectWrapper.unmount();
    });

    test('Select component renders without crashing', () => {
        selectWrapper = manyWhoMount();
        expect(selectWrapper.length).toEqual(1);
    });

    test('Select component gets registered', () => {
        selectWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
