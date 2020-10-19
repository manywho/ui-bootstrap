import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { merge } from 'ramda';
import FeedInput from '../js/components/feed-input';

describe('FeedInput component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    const defaultProps = {
        send: jest.fn(),
        isAttachmentsEnabled: false,
        caption: '',
        messageId: 1,
        id: 2,
    };

    function manyWhoMount(props?: any) {
        const propsWithDefaults = merge(defaultProps, props);

        return mount(<FeedInput {...propsWithDefaults} />);
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

    test('Component does not render file upload if attachments are disabled', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.find('.feed-post-text').children().length).toBe(1);
    });

    test('Component renders file upload if attachments are enabled', () => {
        componentWrapper = shallow(<FeedInput {...defaultProps} isAttachmentsEnabled />);
        expect(componentWrapper.find('.feed-post-text').children().length).toBe(2);
    });

    test('Send is called with correct arguments when enter is pressed', () => {
        componentWrapper = manyWhoMount();
        const mockEvent = {
            charCode: 13,
            shiftKey: false,
            preventDefault: () => {},
            stopPropagation: () => {},
        };
        componentWrapper.setState({
            attachedFiles: ['file'],
            mentionedUsers: { id: 1 },
        });

        componentWrapper.find('.feed-message-text').simulate('keypress', mockEvent);
        expect(defaultProps.send).toHaveBeenCalledWith('', 1, { id: 1 }, ['file']);
    });

    test('Send is called with correct arguments when the "Send" button is clicked', () => {
        componentWrapper = manyWhoMount();
        componentWrapper.setState({
            attachedFiles: ['file'],
            mentionedUsers: { id: 1 },
        });

        componentWrapper.find('.feed-post-send').simulate('click');
        expect(defaultProps.send).toHaveBeenCalledWith('', 1, { id: 1 }, ['file']);
    });
});
