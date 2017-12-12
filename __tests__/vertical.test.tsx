import { str } from '../test-utils';

import * as React from 'react';
import { mount } from 'enzyme';

import Vertical from '../js/components/vertical';

describe('Vertical component behaviour', () => {

    let componentWrapper;

    let propChildren;
    let propFlowKey;

    const globalAny:any = global;

    function manyWhoMount(children = null) {

        propFlowKey = str(5);
        propChildren = children;

        globalAny.window.manywho.model = {
            getChildren: jest.fn(() => []),
        };

        if (propChildren !== null) {
            return mount(<Vertical flowKey={propFlowKey}>{propChildren}</Vertical>);
        }

        return mount(<Vertical flowKey={propFlowKey} />);
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
        expect(globalAny.window.manywho.component.registerContainer)
        .toHaveBeenCalledWith('vertical_flow', Vertical); 
    });

    test('Component styling callback gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.styling.registerContainer)
        .toHaveBeenCalledWith('vertical_flow', expect.any(Function)); 
    });

    test('Children get rendered if supplied', () => {
        componentWrapper = manyWhoMount('text child');
        expect(componentWrapper.find('#vertical').text()).toEqual('text child');
    });

    test('getChildComponents gets called if no children supplied', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getChildComponents).toHaveBeenCalled();
    });
    
    test('model.getChildren gets called if no children supplied', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.model.getChildren).toHaveBeenCalled();
    });
});
