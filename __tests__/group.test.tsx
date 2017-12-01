import * as React from 'react';
import { mount } from 'enzyme';

import Group from '../js/components/group';

describe('Group component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        return mount(<Group />);
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
        expect(globalAny.window.manywho.component.registerContainer)
        .toHaveBeenCalledWith('group', Group); 
    });

});
