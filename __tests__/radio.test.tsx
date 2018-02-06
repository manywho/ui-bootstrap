import * as React from 'react';
import { shallow } from 'enzyme';
import { str } from '../test-utils';

import Radio from '../js/components/radio';

describe('Radio component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.component.getDisplayColumns = () => [
            { typeElementPropertyId: str() },
        ];

        return shallow(<Radio />);
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
        .toHaveBeenCalledWith('radio', Radio); 
    });

});
