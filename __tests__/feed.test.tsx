import * as React from 'react';
import { shallow } from 'enzyme';

import Feed from '../js/components/feed';

jest.mock('jquery', () => {
    return () => ({
        textcomplete: () => {},
    });
});

describe('Feed component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        return shallow(<Feed />);
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
        .toHaveBeenCalledWith('feed', Feed); 
    });

});
