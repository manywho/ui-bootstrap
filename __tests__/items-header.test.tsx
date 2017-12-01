import * as React from 'react';
import { shallow } from 'enzyme';

import ItemsHeader from '../js/components/items-header';

describe('ItemsHeader component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        const props = {
            isSearchable: true,
            isRefreshable: true,
            outcomes: [],
            refresh: () => {},
        };

        return shallow(<ItemsHeader {...props} />);
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
        .toHaveBeenCalledWith('mw-items-header', ItemsHeader); 
    });

});
