

import * as React from 'react';

import { mount } from 'enzyme';

import Status from '../js/components/status';

describe('Status input component behaviour', () => {

    let statusWrapper;

    const globalAny:any = global;
    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
    };

    function manyWhoMount() {
        globalAny.window.manywho['model'] = {
            getInvokeType: jest.fn(),
        };
        return mount(<Status {...props} />);
    }

    afterEach(() => {
        statusWrapper.unmount();
    });

    test('Status component renders without crashing', () => {
        statusWrapper = manyWhoMount();
        expect(statusWrapper.length).toEqual(1);
    });

    test('Status component gets registered', () => {
        statusWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
