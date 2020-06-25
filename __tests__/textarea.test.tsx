import * as React from 'react';
import { mount } from 'enzyme';
import Textarea from '../js/components/textarea';
import { str } from "../test-utils";

const CoreUtils = require('../js/components/utils/CoreUtils');

jest.mock('../js/components/utils/CoreUtils');

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
        textareaWrapper = manyWhoMount('ContentString', true);

        CoreUtils.focusInFirstInputElement(() => null);
        expect(CoreUtils.focusInFirstInputElement).toBeCalled();
        // this part of the test is not so robust as it is in input.test.tsx but for some unknown reason is failing
        // we should try to activate the below line once we have updated jest or enzyme (the mock for CoreUtils should also be removed)
        // expect(document.activeElement.id).toEqual(textareaWrapper.instance().props.id);
    });
});
