import * as React from 'react';
import { shallow } from 'enzyme';

import Login from '../js/components/login';

describe('Login component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    const props = {
        callback: {
            execute: { apply: jest.fn() },
            context: 'testContext',
            args: [{
                execute: null,
                context: null,
                args: null,
            }],
        },
        loginUrl: 'testLoginUrl',
        stateId: 'testStateId',
        username: 'testUsername',
        directoryName: 'testDirectoryName',
        flowKey: 'testFlowKey',
    };

    const tenantId = 'testTenantId';

    const mockSuccess = 'mockSuccess';

    const mockFailWithObjectNoMessageJSON = {
        responseJSON: { json: true },
        responseText: 'responseTextError',
    }

    const mockFailWithObjectMessageJSON = {
        responseJSON: { message: 'responseJSONMessage' },
        responseText: 'responseTextError',
    }

    const mockFailWithStringJSON = {
        responseJSON: 'responseJSONError',
        responseText: 'responseTextError',
    }

    const mockSuccessAjax = () => ({
        then: (thenFunction) => { thenFunction(mockSuccess); return ({ fail: () => {} }) },
    });

    const mockFailWithObjectNoMessageJSONAjax = () => ({
        then: () => ({ fail: (failFunction) => failFunction(mockFailWithObjectNoMessageJSON) }),
    });

    const mockFailWithObjectMessageJSONAjax = () => ({
        then: () => ({ fail: (failFunction) => failFunction(mockFailWithObjectMessageJSON) }),
    });

    const mockFailWithStringJSONAjax = () => ({
        then: () => ({ fail: (failFunction) => failFunction(mockFailWithStringJSON) }),
    });

    function manyWhoMount() {

        globalAny.window.manywho.model.getComponent = () => ({
            attributes: {},
        });
        globalAny.window.manywho.authorization = { setAuthenticationToken: jest.fn() };
        globalAny.window.manywho.state.setLogin = jest.fn();
        globalAny.window.manywho.utils.extractTenantId = jest.fn(() => tenantId);
        globalAny.window.manywho.utils.isNullOrWhitespace = (value: string): boolean => {
            if (typeof value === 'undefined' || value === null) {
                return true;
            }
            return value.replace(/\s/g, '').length < 1;
        };

        return shallow(<Login {...props} />);
    }

    beforeEach(() => {
        globalAny.window.manywho.ajax = { login: jest.fn(mockSuccessAjax) };
    });

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

    test('When OnSubmit login is called without username or password, an error is shown', () => {
        componentWrapper = manyWhoMount();
        
        const username = 'test@example.com';
        const password = 'test';
        
        // First test without any data
        componentWrapper.instance().setState({
            username: null,
            password: null
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).not.toBeCalled();
        expect(componentWrapper.state('usernameError')).toBe('This field is required.');
        expect(componentWrapper.state('passwordError')).toBe('This field is required.');

        componentWrapper = manyWhoMount();

        // Then test without username
        componentWrapper.instance().setState({
            username: null,
            password
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).not.toBeCalled();
        expect(componentWrapper.state('usernameError')).toBe('This field is required.');
        expect(componentWrapper.state('passwordError')).toBe("");

        componentWrapper = manyWhoMount();

        // Then test without password
        componentWrapper.instance().setState({
            username,
            password: null
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).not.toBeCalled();
        expect(componentWrapper.state('usernameError')).toBe("");
        expect(componentWrapper.state('passwordError')).toBe('This field is required.');
    });

    test('When OnSubmit login succeeds, manywho state, auth and callback is updated to auth details', () => {
        componentWrapper = manyWhoMount();
        
        const username = 'test@example.com';
        const password = 'test';
        
        componentWrapper.instance().setState({
            username,
            password
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).toHaveBeenCalledWith(
            props.loginUrl,
            username,
            password,
            null,
            null,
            props.stateId,
            tenantId,
        );

        expect(manywho.state.setLogin).toHaveBeenCalledWith(
            null,
            props.flowKey
        );
        expect(manywho.authorization.setAuthenticationToken).toHaveBeenCalledWith(
            mockSuccess,
            props.flowKey
        );
        expect(props.callback.execute.apply).toHaveBeenCalledWith(
            props.callback.context,
            [props.callback].concat(props.callback.args)
        );
        expect(componentWrapper.state('faults')).toBe(null);
    });

    test('When OnSubmit login fails, and the error responseJSON is a string, the string is displayed', () => {
        globalAny.window.manywho.ajax = { login: jest.fn(mockFailWithStringJSONAjax) };
        
        componentWrapper = manyWhoMount();
        
        const username = 'test@example.com';
        const password = 'test';
        
        componentWrapper.instance().setState({
            username,
            password
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).toHaveBeenCalledWith(
            props.loginUrl,
            username,
            password,
            null,
            null,
            props.stateId,
            tenantId,
        );

        expect(componentWrapper.state('loading')).toBe(null);
        expect(componentWrapper.state('password')).toBe('');
        expect(componentWrapper.state('faults')).toBe(mockFailWithStringJSON.responseJSON);
    });

    test('When OnSubmit login fails, and the error responseJSON is not a string, but responseJSON.message is, then responseJSON.message is displayed', () => {
        globalAny.window.manywho.ajax = { login: jest.fn(mockFailWithObjectMessageJSONAjax) };
        
        componentWrapper = manyWhoMount();
        
        const username = 'test@example.com';
        const password = 'test';
        
        componentWrapper.instance().setState({
            username,
            password
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).toHaveBeenCalledWith(
            props.loginUrl,
            username,
            password,
            null,
            null,
            props.stateId,
            tenantId,
        );

        expect(componentWrapper.state('loading')).toBe(null);
        expect(componentWrapper.state('password')).toBe('');
        expect(componentWrapper.state('faults')).toBe(mockFailWithObjectMessageJSON.responseJSON.message);
    });

    test('When OnSubmit login fails, and the error responseJSON is not a string, and responseJSON.message also isn\'t, then responseText is displayed', () => {
        globalAny.window.manywho.ajax = { login: jest.fn(mockFailWithObjectNoMessageJSONAjax) };
        
        componentWrapper = manyWhoMount();
        
        const username = 'test@example.com';
        const password = 'test';
        
        componentWrapper.instance().setState({
            username,
            password
        });
        
        componentWrapper.instance().onSubmit();

        expect(globalAny.window.manywho.ajax.login).toHaveBeenCalledWith(
            props.loginUrl,
            username,
            password,
            null,
            null,
            props.stateId,
            tenantId,
        );

        expect(componentWrapper.state('loading')).toBe(null);
        expect(componentWrapper.state('password')).toBe('');
        expect(componentWrapper.state('faults')).toBe(mockFailWithObjectNoMessageJSON.responseText);
    });

});
