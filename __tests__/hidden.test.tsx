import { str } from '../test-utils';

import * as React from 'react';
import { mount } from 'enzyme';

import Hidden from '../js/components/hidden';

describe('Hidden component behaviour', () => {

    let hiddenWrapper;
    let propID;

    const globalAny:any = global;

    beforeEach(() => {
        propID = str(5);
        hiddenWrapper = mount(<Hidden id={propID} />);
    });

    afterEach(() => {
        hiddenWrapper.unmount();
    });

    test('Hidden component renders without crashing', () => {
        expect(hiddenWrapper.length).toEqual(1);
    });

    test('Hidden props are set', () => {
        expect(hiddenWrapper.props().id).toEqual(propID);
    });

    test('Component gets registered', () => {
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Component should render an empty div element', () => {
        const htmlOutput = hiddenWrapper.html();
        expect(htmlOutput).toEqual('<noscript></noscript>');
    });
});
