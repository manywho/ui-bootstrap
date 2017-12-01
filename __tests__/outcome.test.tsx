import * as React from 'react';
import { shallow } from 'enzyme';
import { str } from '../test-utils';

import Outcome from '../js/components/outcome';

describe('Outcome component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.settings.global = str;

        return shallow(<Outcome />);
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
        .toHaveBeenCalledWith('outcome', Outcome); 
    });

});
