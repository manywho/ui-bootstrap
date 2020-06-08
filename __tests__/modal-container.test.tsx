import * as React from 'react';
import { shallow } from 'enzyme';
import { noop, str, t, f } from '../test-utils';

import ModalContainer from '../js/components/modal-container';

describe('ModalContainer component behaviour', () => {

    test('Component renders without crashing', () => {

        const props = {
            title: str(),
            content: str(),
            onConfirm: noop,
            onCancel: noop,
        };

        expect(shallow(<ModalContainer {...props} />).length).toEqual(1);
    });

    test('Clicking cancel calls onCancel', () => {

        const props = {
            content: str(),
            onCancel: jest.fn(),
        };

        const wrapper = shallow(<ModalContainer {...props} />);
        const button = wrapper.find('.btn-default');

        expect(button.text()).toEqual('Cancel');
        
        button.simulate('click');
        expect(props.onCancel).toHaveBeenCalled();
    });

    test('Clicking confirm calls onConfirm', () => {

        const props = {
            content: str(),
            onConfirm: jest.fn(),
        };

        const wrapper = shallow(<ModalContainer {...props} />);
        const button = wrapper.find('.btn-primary');

        expect(button.text()).toEqual('OK');
        
        button.simulate('click');
        expect(props.onConfirm).toHaveBeenCalled();
    });

    test('Supplied labels are rendered in buttons', () => {

        const props = {
            content: str(),
            onConfirm: jest.fn(),
            onCancel: jest.fn(),
            confirmLabel: 'aaa',
            cancelLabel: 'bbb',
        };

        const wrapper = shallow(<ModalContainer {...props} />);
        expect(wrapper.find('.btn-primary').text()).toEqual('aaa');
        expect(wrapper.find('.btn-default').text()).toEqual('bbb');
    });

    test('Global modal property is set to null when escape is pressed', () => {

        window.manywho.model.setModal = jest.fn();

        const props = {
            flowKey: 'zzz',
            content: str(),
            onConfirm: jest.fn(),
            onCancel: jest.fn(),
        };

        const wrapper = shallow(<ModalContainer {...props} />);
        wrapper.simulate('keyup', { 
            keyCode: 27,
        })
        expect(window.manywho.model.setModal).toHaveBeenCalledWith('zzz', null);
    });

    test('Supplied content is rendered', () => {

        const props = {
            content: <input className="my-input" />,
        };

        const wrapper = shallow(<ModalContainer {...props} />);
        expect(wrapper.exists('.my-input')).toBe(true);
    });


    test('Header is conditionally rendered', () => {

        const props = {
            title: <h1 className="my-header">Title</h1>,
        };
        
        window.manywho.utils.isNullOrEmpty = f;
        
        const wrapper = shallow(<ModalContainer {...props} />);
        expect(wrapper.exists('.my-header')).toBe(true);

        window.manywho.utils.isNullOrEmpty = t;

        const wrapper2 = shallow(<ModalContainer {...props} />);
        expect(wrapper2.exists('.my-header')).toBe(false);
    });

    test('Footer and footer buttons are conditionally rendered', () => {

        const props1 = {};

        const props2 = {
            onConfirm: noop,
        };

        const props3 = {
            onCancel: noop,
        };
        
        const wrapper1 = shallow(<ModalContainer {...props1} />);
        expect(wrapper1.exists('.modal-footer')).toBe(false);

        const wrapper2 = shallow(<ModalContainer {...props2} />);
        expect(wrapper2.exists('.modal-footer')).toBe(true);
        expect(wrapper2.exists('.btn-default')).toBe(false);
        expect(wrapper2.exists('.btn-primary')).toBe(true);

        const wrapper3 = shallow(<ModalContainer {...props3} />);
        expect(wrapper3.exists('.modal-footer')).toBe(true);
        expect(wrapper3.exists('.btn-default')).toBe(true);
        expect(wrapper3.exists('.btn-primary')).toBe(false);
    });

});
