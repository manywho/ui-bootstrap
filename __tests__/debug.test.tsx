import * as React from 'react';
import { shallow } from 'enzyme';

import Debug from '../js/components/debug';

describe('Debug component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(label = null) {

        globalAny.window.manywho.settings.isDebugEnabled = () => true;
        globalAny.window.manywho.model.getRootFaults = () => [];
        globalAny.window.manywho.model.getPreCommitStateValues = () => [];
        globalAny.window.manywho.model.getStateValues = () => [];
        globalAny.window.manywho.model.getExecutionLog = () => ({});

        return shallow(<Debug />);
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
        .toHaveBeenCalledWith('debug', Debug); 
    });

});
