import * as React from 'react';
import { shallow } from 'enzyme';

import Container from '../js/components/container';

describe('Container component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(label = null) {

        globalAny.window.manywho.component.getByName = () => 'div';

        return shallow(<Container />);
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
        .toHaveBeenCalledWith('mw-container', Container); 
    });

});
