

import * as React from 'react';

import { mount } from 'enzyme';

import Textarea from '../js/components/textarea';

describe('Textarea component behaviour', () => {

    let textareaWrapper;
    const globalAny:any = global;

    function manyWhoMount() {
        return mount(<Textarea />);
    }

    afterEach(() => {
        textareaWrapper.unmount();
    });

    test('Textarea component renders without crashing', () => {
        textareaWrapper = manyWhoMount();
        expect(textareaWrapper.length).toEqual(1);
    });

    test('Textarea component gets registered', () => {
        textareaWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
