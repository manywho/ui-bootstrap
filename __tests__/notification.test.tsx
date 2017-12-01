import * as React from 'react';
import { shallow } from 'enzyme';

import Notification from '../js/components/notification';

describe('Notification component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        const props = {
            model: {
                type: 'xxx',
                message: 'xxx',
                timeout: 1000,
                dismissible: false,
            },
        };

        return shallow(<Notification {...props} />);
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
        .toHaveBeenCalledWith('notification', Notification); 
    });

});
