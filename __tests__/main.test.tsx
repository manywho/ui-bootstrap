import * as React from 'react';
import { shallow } from 'enzyme';

import Main from '../js/components/main';

describe('Main component behaviour', () => {

    const globalAny:any = global;

    test('Component renders without crashing', () => {
        expect(shallow(<Main />).length).toEqual(1);
    });

    test('Component gets registered', () => {
        shallow(<Main />);
        expect(globalAny.window.manywho.component.register)
        .toHaveBeenCalledWith('main', Main); 
    });

    test('Modal renders with correct props', () => {

        const model = {
            title: 'title',
            content: 'content',
            flowKey: 'flowKey',
            onConfirm: 'onConfirm',
            onCancel: 'onCancel',
            confirmLabel: 'confirmLabel',
            cancelLabel: 'cancelLabel',
        };

        window.manywho.model.getModal = () => model;

        const wrapper = shallow(<Main />);

        expect(wrapper.find('ModalContainer').props()).toEqual(model);
    });

});
