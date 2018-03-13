import * as React from 'react';
import { shallow } from 'enzyme';
import { str } from '../test-utils';

import Outcomes from '../js/components/outcomes';

describe('Outcomes component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        {
            isDesignTime = false,
            group = str(),
        } = {},
    ) {
        const props = {
            isDesignTime,
        };
        
        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {
                group,
            },
        });

        return shallow(<Outcomes {...props} />);
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

    test('Dummy outcome elements get rendered if in design time', () => {
        componentWrapper = manyWhoMount({
            isDesignTime: true,
        });

        expect(componentWrapper.find('.btn-primary').length).toBe(1);
        expect(componentWrapper.find('.btn-success').length).toBe(1);
        expect(componentWrapper.find('.btn-danger').length).toBe(1);
        
    });

    test('.btn-group element gets rendered if group is horizontal', () => {

        globalAny.window.manywho.utils.isEqual = x => x === 'horizontal';

        componentWrapper = manyWhoMount({
            group: 'horizontal',
        });

        expect(componentWrapper.find('.btn-group').length).toBe(1);        
    });

});
