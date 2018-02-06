

import * as React from 'react';

import { mount } from 'enzyme';

import ReturnToParent from '../js/components/returnToParent';

const globalAny:any = global;

describe('ReturnParent component behaviour', () => {

    let returnParentWrapper;

    const props = {
        id: 'string',
        parentId: 'string',
        flowKey: 'string',
        parentStateId: 'string',
    };

    function manyWhoMount() {
        return mount(<ReturnToParent {...props} />);
    }

    afterEach(() => {
        returnParentWrapper.unmount();
    });

    test('ReturnParent component renders without crashing', () => {
        returnParentWrapper = manyWhoMount();
        expect(returnParentWrapper.length).toEqual(1);
    });

    test('ReturnParent component gets registered', () => {
        returnParentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
