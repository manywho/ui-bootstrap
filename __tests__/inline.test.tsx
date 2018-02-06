import * as React from 'react';
import { shallow } from 'enzyme';
import { str } from '../test-utils';

import { default as Inline, getInline } from '../js/components/inline';

describe('Inline component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        {
            children = null,
            id = 'a',
            flowKey = 'b',
        } = {},    
    ) {

        const props = {
            children, id, flowKey,
        };

        return shallow(<Inline {...props} />);
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
        .toHaveBeenCalledWith('inline_flow', Inline); 
    });

    test('Component styling gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.styling.registerContainer)
        .toHaveBeenCalledWith('inline_flow', expect.any(Function)); 
    });

    test('getInline returns Inline component', () => {
        componentWrapper = manyWhoMount();
        expect(getInline()).toBe(Inline);
    });

    test('Children get rendered', () => {
        const children = str();

        componentWrapper = manyWhoMount({
            children,
        });
        
        expect(componentWrapper.find('.clearfix').first().text())
        .toBe(children); 
    });

    test('model.getChildren is called with correct id and flowKey', () => {
        const id = str();
        const flowKey = str();

        componentWrapper = manyWhoMount({
            id,
            flowKey,
        });
        
        expect(globalAny.window.manywho.model.getChildren)
        .toBeCalledWith(id, flowKey); 
    });

    test('component.getChildComponents is called with correct childData, id and flowKey', () => {
        const id = str();
        const flowKey = str();
        const childData = str();

        globalAny.window.manywho.model.getChildren = () => childData;

        componentWrapper = manyWhoMount({
            id,
            flowKey,
        });
        
        expect(globalAny.window.manywho.component.getChildComponents)
        .toBeCalledWith(childData, id, flowKey); 
    });

});
