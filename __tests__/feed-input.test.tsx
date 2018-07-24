import * as React from 'react';
import { shallow } from 'enzyme';

import FeedInput from '../js/components/feed-input';

jest.mock('jquery', () => {
    return () => ({
        textcomplete: () => {},
    });
});

jest.mock('jquery-textcomplete', () => {
    return () => {};
});

describe('FeedInput component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        return shallow(<FeedInput send={() => {}} isAttachmentsEnabled={false} caption={''} />);
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
        .toHaveBeenCalledWith('feed-input', FeedInput); 
    });

});
