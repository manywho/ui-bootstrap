import * as React from 'react';
import { shallow } from 'enzyme';

import ItemsContainer from '../js/components/items-container';

describe('ItemsContainer component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.model.getComponent = () => ({
            objectData: [],
            attributes: {},
        });

        return shallow(<ItemsContainer />);
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
        .toHaveBeenCalledWith('mw-items-container', ItemsContainer); 
    });

});
