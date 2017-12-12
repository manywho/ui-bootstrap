import * as React from 'react';
import { shallow } from 'enzyme';
import { str, noop } from '../test-utils';

import Outcome from '../js/components/outcome';

describe('Outcome component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        { 
            className = null,
            type = '',
            size = '',
            pageActionType = str(),
            pageActionBindingType = null,
            classes = '',
            addNoBackgroundClass = false,
            uri = null,
            target = '_blank',
            onClick = null,
            display = '',
        } = {},
    ) {

        globalAny.window.manywho.component.onOutcome = jest.fn();
        globalAny.window.manywho.settings.global = str;
        globalAny.window.manywho.utils.isEqual = () => addNoBackgroundClass;
        globalAny.window.manywho.model.getOutcome = () => {
            return {
                pageActionType,
                pageActionBindingType,
                attributes: {
                    type,
                    size,
                    classes,
                    uri,
                    target,
                    display,
                },
            };
        };

        return shallow(<Outcome className={className} onClick={onClick} display={null} />);
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
        .toHaveBeenCalledWith('outcome', Outcome); 
    });

    test('Component receives correct type CSS classes', () => {
        const type = str(5);

        componentWrapper = manyWhoMount({
            type,
            pageActionType: 'import',
        });

        expect(componentWrapper.hasClass(`btn-${type}`)).toBe(true);
    });

    test('Component receives correct size CSS class', () => {
        const size = str(5);

        componentWrapper = manyWhoMount({
            size,
        });

        expect(componentWrapper.hasClass(`btn-${size}`)).toBe(true);
    });

    test('Component receives correct pageActionType CSS classes', () => {
        componentWrapper = manyWhoMount({
            pageActionType: 'import',
        });

        expect(componentWrapper.hasClass(`btn-success`)).toBe(true);
    });

    test('Component receives CSS classes from attributes', () => {
        const classes = str(5);

        componentWrapper = manyWhoMount({
            classes,
        });

        expect(componentWrapper.hasClass(classes)).toBe(true);
    });

    test('Component receives btn-nobackground CSS class when required', () => {
        componentWrapper = manyWhoMount({
            addNoBackgroundClass: true,
        });

        expect(componentWrapper.hasClass('btn-nobackground')).toBe(true);
    });

    test('Use anchor element when uri supplied', () => {
        componentWrapper = manyWhoMount({
            uri: str(24),
        });

        expect(componentWrapper.is('a')).toBe(true);
    });

    test('Use target attribute when supplied', () => {
        const target = '_self';

        componentWrapper = manyWhoMount({
            target,
            uri: str(24),
        });

        expect(componentWrapper.props().target).toBe(target);
    });

    test('Component receives CSS classes from props', () => {
        const classes = str(5);

        componentWrapper = manyWhoMount({
            className: classes,
        });

        expect(componentWrapper.hasClass(classes)).toBe(true);
    });

    test('On click manywho.component.onOutcome gets called by default', () => {
        componentWrapper = manyWhoMount();

        componentWrapper.simulate('click', {
            preventDefault: noop,
            stopPropagation: noop,
        });

        expect(globalAny.window.manywho.component.onOutcome).toBeCalled();
    });

    test('On click props.onClick gets called when supplied', () => {
        const onClick = jest.fn();

        componentWrapper = manyWhoMount({
            onClick,
        });

        componentWrapper.simulate('click', {
            preventDefault: noop,
            stopPropagation: noop,
        });

        expect(onClick).toBeCalled();
    });

    test('Icon is rendered when required', () => {

        globalAny.window.manywho.utils.isNullOrWhitespace = (str) => {
            return str === 'insert' ? false : true;
        };

        componentWrapper = manyWhoMount({
            display: 'ICON',
            pageActionType: 'insert',
        });

        expect(componentWrapper.find('.glyphicon').hasClass('glyphicon-log-in')).toBe(true);
    });

    test('glyphicon type is not rendered when pageActionType and pageActionBindingType are null', () => {

        globalAny.window.manywho.utils.isNullOrWhitespace = x => x === null;

        componentWrapper = manyWhoMount({
            display: 'ICON',
            pageActionType: null,
            pageActionBindingType: null,
        });

        expect(componentWrapper.find('.glyphicon').first().props().className).toBe('glyphicon ');
    });

});
