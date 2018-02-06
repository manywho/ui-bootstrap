import { str } from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Login from '../js/components/login';

describe('Login component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        const props = {
            callback: {
                execute: () => {},
                context: {},
                args: {},
            },
            loginUrl: str(5),
            stateId: str(5),
            username: str(5),
            directoryName: str(5),
        };

        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {},
        });

        return shallow(<Login {...props} />);
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
        .toHaveBeenCalledWith('mw-login', Login, ['mw_login']); 
    });

});
