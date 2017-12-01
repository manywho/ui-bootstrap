import * as React from 'react';
import { shallow } from 'enzyme';

import Outcomes from '../js/components/outcomes';

describe('Outcomes component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {
        
        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {
                group: 'xxx',
            },
        });

        return shallow(<Outcomes />);
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
        .toHaveBeenCalledWith('outcomes', Outcomes); 
    });

});
