import * as React from 'react';
import { shallow } from 'enzyme';

import List from '../js/components/list';

describe('List component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {},
        });

        return shallow(<List />);
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
        .toHaveBeenCalledWith('list', List); 
    });

});
