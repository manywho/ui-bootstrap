import { str } from '../test-utils';
import * as React from 'react';
import { mount } from 'enzyme';

import Horizontal from '../js/components/horizontal';

describe('Horizontal component behaviour', () => {

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
            return mount(<Horizontal flowKey={propFlowKey}>{propChildren}</Horizontal>);
        }

        return mount(<Horizontal flowKey={propFlowKey} />);
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
        .toHaveBeenCalledWith('horizontal_flow', Horizontal); 
    });

    test('Component styling callback gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.styling.registerContainer)
        .toHaveBeenCalledWith('horizontal_flow', expect.any(Function)); 
    });

    test('Children get rendered if supplied', () => {
        componentWrapper = manyWhoMount('text child');
        expect(componentWrapper.find('#horizontal').text()).toEqual('text child');
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
