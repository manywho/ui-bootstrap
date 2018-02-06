import * as React from 'react';
import { shallow } from 'enzyme';
import { noop } from '../test-utils';

import Modal from '../js/components/modal';

describe('Modal component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        const containerElement = {
            classList: {
                remove: noop,
            },
        } as HTMLElement;

        return shallow(<Modal container={containerElement} />);
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
        .toHaveBeenCalledWith('modal', Modal, ['modal-standalone']); 
    });

});
