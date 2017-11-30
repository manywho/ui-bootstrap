import testUtils from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Content from '../js/components/content';

describe('Content component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(label = null) {

        //globalAny.window.manywho.component.getByName = () => 'div';

        return shallow(<Content />);
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
        expect(globalAny.window.manywho.component.register)
        .toHaveBeenCalledWith('content', Content); 
    });

});
