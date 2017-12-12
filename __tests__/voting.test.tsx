

import * as React from 'react';

import { mount } from 'enzyme';

import Voting from '../js/components/voting';

describe('Voting component behaviour', () => {

    let votingWrapper;
    const globalAny:any = global;

    function manyWhoMount() {
        globalAny.window.manywho['model'] = {
            getInvokeType: jest.fn(),
        };
        return mount(<Voting />);
    }

    afterEach(() => {
        votingWrapper.unmount();
    });

    test('Voting component renders without crashing', () => {
        votingWrapper = manyWhoMount();
        expect(votingWrapper.length).toEqual(1);
    });

    test('Voting component gets registered', () => {
        votingWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });
});
