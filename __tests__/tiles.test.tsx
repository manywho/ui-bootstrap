

import * as React from 'react';

import { mount } from 'enzyme';

import Tiles from '../js/components/tiles';

describe('Tiles component behaviour', () => {

    let tilesWrapper;
    const globalAny:any = global;

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
        page: 12,
        limit: 12,
        isLoading: true,
        sort: jest.fn(),
        sortedBy: true,
        sortedIsAscending: 'string',
    };

    function manyWhoMount() {
        return mount(<Tiles {...props} />);
    }

    afterEach(() => {
        tilesWrapper.unmount();
    });

    test('Tiles component renders without crashing', () => {
        tilesWrapper = manyWhoMount();
        expect(tilesWrapper.length).toEqual(1);
    });

    test('Tiles component gets registered', () => {
        tilesWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
