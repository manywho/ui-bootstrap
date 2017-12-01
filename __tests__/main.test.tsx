import * as React from 'react';
import { shallow } from 'enzyme';

import Main from '../js/components/main';

describe('Main component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.manywho.component.mixins = {
            enterKeyHandler: {
                onEnter: () => {},
            },
        };

        return shallow(<Main />);
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
        .toHaveBeenCalledWith('main', Main); 
    });

});
