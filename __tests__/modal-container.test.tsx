import * as React from 'react';
import { shallow } from 'enzyme';
import { noop, str } from '../test-utils';

import ModalContainer from '../js/components/modal-container';

describe('ModalContainer component behaviour', () => {

    let componentWrapper;

    function manyWhoMount() {

        const props = {
            title: str(),
            content: str(),
            onConfirm: noop,
            onCancel: noop,
        };

        return shallow(<ModalContainer {...props} />);
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.length).toEqual(1);
    });

});
