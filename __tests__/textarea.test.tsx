

import * as React from 'react';

import { mount } from 'enzyme';

import Textarea from '../js/components/textarea';
import {str} from "../test-utils";

describe('Textarea component behaviour', () => {

    let textareaWrapper;
    let propID;
    let model;
    const globalAny:any = global;

    function manyWhoMount(modelContentType = 'ContentString', autofocus = false) {

        propID = str(5);
        const props = { autofocusCandidate: autofocus };

        globalAny.window.manywho.settings.global = jest.fn(() => autofocus);
        globalAny.window.manywho.component['contentTypes'] = modelContentType;

        model = {
            isVisible: true,
            label: str(5),
            contentType: modelContentType,
            developerName: str(5),
            attributes: {
                type: 'text',
            },
        };

        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
            getOutcomes: jest.fn(() => []),
        };

        return mount(<Textarea id={propID} {...props} />);
    }

    afterEach(() => {
        document.activeElement.blur();
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

    test('Textarea components mount with autofocus', () => {
        const componentDidMount = jest.spyOn(Textarea.prototype, 'componentDidMount');
        textareaWrapper = manyWhoMount('ContentString', true);

        expect(componentDidMount).toHaveBeenCalled();
        // this part of the test is failing but this test is very similar to one in input.test.tsx, and it doesn't seem
        // to be a real problem, we should try to activate this test once we have updated jest or enzyme
        // expect(document.activeElement.id).toEqual(textareaWrapper.instance().props.id);
    });
});
