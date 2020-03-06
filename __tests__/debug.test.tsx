import * as React from 'react';
import { shallow } from 'enzyme';
import { str } from '../test-utils';

import Debug from '../js/components/debug';

const FRAME1 = str(10);
const FRAME2 = str(10);
const FRAME3 = str(10);

const FRAMES_FIXTURE = [
    {
        flowDeveloperName: FRAME1,
        flowId: FRAME1,
        mapElementDeveloperName: FRAME1,
        mapElementId: FRAME1,
    },
    {
        flowDeveloperName: FRAME2,
        flowId: FRAME2,
        mapElementDeveloperName: FRAME2,
        mapElementId: FRAME2,
    },
    {
        flowDeveloperName: FRAME3,
        flowId: FRAME3,
        mapElementDeveloperName: FRAME3,
        mapElementId: FRAME3,
    },
];

describe('Debug component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    globalAny.manywho.settings.isDebugEnabled = () => true;
    globalAny.manywho.model.getRootFaults = () => [];
    globalAny.manywho.model.getPreCommitStateValues = () => [];
    globalAny.manywho.model.getStateValues = () => [];
    globalAny.manywho.model.getExecutionLog = () => ({});
    globalAny.manywho.model.getFrames = jest.fn(() => []);


    function manyWhoMount() {
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

    test('Frames get listed', () => {
        globalAny.manywho.model.getFrames.mockImplementation(() => FRAMES_FIXTURE);

        componentWrapper = manyWhoMount();

        expect(componentWrapper.find('ol').at(0).props()['data-value-id']).toBe('foo');
        expect(componentWrapper.find('ol').at(1).props()['data-value-id']).toBe('bar');
        expect(componentWrapper.find('ol').at(2).props()['data-value-id']).toBe('fizz');
    });
});
