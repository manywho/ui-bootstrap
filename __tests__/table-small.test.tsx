import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import TableSmall from '../js/components/table-small';

describe('Table Small input component behaviour', () => {

    let tableSmallWrapper;

    const globalAny:any = global;
    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        onOutcome: jest.fn(),
        isValid: true,
        objectData: [],
        outcomes: { id: 'string' }[0],
        displayColumns: [],
    };

    function manyWhoMount() {
        return mount(<TableSmall {...props} />);
    }

    afterEach(() => {
        tableSmallWrapper.unmount();
    });

    test('Table Small component renders without crashing', () => {
        tableSmallWrapper = manyWhoMount();
        expect(tableSmallWrapper.length).toEqual(1);
    });

    test('Table Small component gets registered', () => {
        tableSmallWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
