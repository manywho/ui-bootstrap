import { str } from '../test-utils';

import * as React from 'react';
import { mount } from 'enzyme';

import Wait from '../js/components/wait';

describe('Wait component behaviour', () => {

    let waitWrapper;
    let propIsSmall;
    let propIsVisible;
    let propMessage;

    const globalAny:any = global;

    function manyWhoMount(
        isSmall = false,
        isVisible = false,
        message = str(5),
    ) {

        propIsSmall = isSmall;
        propIsVisible = isVisible;
        propMessage = message;

        return mount(<Wait isSmall={propIsSmall} isVisible={propIsVisible} message={propMessage} />);
    }

    afterEach(() => {
        waitWrapper.unmount();
    });

    test('Wait component renders without crashing', () => {
        waitWrapper = manyWhoMount();
        expect(waitWrapper.length).toEqual(1);
    });

    test('Wait props are set', () => {
        waitWrapper = manyWhoMount();
        expect(waitWrapper.props().isSmall).toEqual(propIsSmall);
        expect(waitWrapper.props().isVisible).toEqual(propIsVisible);
        expect(waitWrapper.props().message).toEqual(propMessage);
    });

    test('Component gets registered', () => {
        waitWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
