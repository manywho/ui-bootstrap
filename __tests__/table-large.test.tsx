import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import TableLarge from '../js/components/table-large';

describe('Table Large input component behaviour', () => {

    let tableLargeWrapper;

    const globalAny:any = global;
    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        model: {
            attributes: {
                borderless: true,
                striped: true,
            },
        },
        objectData: [],   
        selectedRows: { externalId: 'string' }[0],
        totalObjectData: {},
        onHeaderClick: jest.fn(),
        onRowClicked: jest.fn(),
        outcomes: { id: 'string' }[0],
        onOutcome: jest.fn(),
        isFiles: true,
        displayColumns: [],
        sortedBy: 'string',
        sortedIsAscending: true,
        isSelectionEnabled: true,
        onSelect: jest.fn(),
        selectAll: jest.fn(),
    };

    function manyWhoMount() {
        return mount(<TableLarge {...props} />);
    }

    afterEach(() => {
        tableLargeWrapper.unmount();
    });

    test('Table Large component renders without crashing', () => {
        tableLargeWrapper = manyWhoMount();
        expect(tableLargeWrapper.length).toEqual(1);
    });

    test('Table Large component gets registered', () => {
        tableLargeWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
