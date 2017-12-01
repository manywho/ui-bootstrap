import testUtils from '../test-utils';

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
            loginUrl: testUtils.generateRandomString(5),
            stateId: testUtils.generateRandomString(5),
            username: testUtils.generateRandomString(5),
            directoryName: testUtils.generateRandomString(5),
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
