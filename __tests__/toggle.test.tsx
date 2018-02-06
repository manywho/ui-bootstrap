

import * as React from 'react';

import { mount } from 'enzyme';

import Toggle from '../js/components/toggle';

describe('Toggle component behaviour', () => {

    let toggleWrapper;
    const globalAny:any = global;

    function manyWhoMount() {
        return mount(<Toggle />);
    }

    afterEach(() => {
        toggleWrapper.unmount();
    });

    test('Toggle component renders without crashing', () => {
        toggleWrapper = manyWhoMount();
        expect(toggleWrapper.length).toEqual(1);
    });

    test('Toggle component gets registered', () => {
        toggleWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
