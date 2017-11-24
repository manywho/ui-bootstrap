import testUtils from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import Tour from '../js/components/tour';

jest.mock('react-transition-group/CSSTransitionGroup', () => {
    return {
        'default': 'CSSTransitionGroup',
    }
});

describe('Tour component behaviour', () => {

    let tourWrapper;

    let tour = {
        id: '',
        steps: [
            {
                target: 'string',
                title: 'string',
                content: 'string',
                placement: 'string',
                showNext: true,
                showBack: true,
                offset: 1,
                align: 'string',
                order: 1,
                querySelector: true,
            }
        ],
        currentStep: 0,
    }

    let tourProps = {
        tour,
        stepIndex: 0,
    }

    const globalAny:any = global;

    function manyWhoMount(isDesignTime = false, isNullOrWhitespace = null) {

        globalAny.window.manywho.tours['next'] = jest.fn();
        globalAny.window.manywho.tours['previous'] = jest.fn();
        globalAny.window.manywho.tours['done'] = jest.fn();

        globalAny.window.manywho['utils'] = {
            isNullOrWhitespace: jest.fn(),
            isEqual: jest.fn(),
            isNullOrUndefined: jest.fn(),
        };

        return mount(<Tour tour={tourProps.tour} stepIndex={tourProps.stepIndex} />);
    }

    afterEach(() => {
        tourWrapper.unmount();
    });

    test('Tour component renders without crashing', () => {
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.length).toEqual(1);
        expect(tourWrapper.find('.close').exists()).toEqual(true);
    });

    test('Tour props are set', () => {
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.props().tour).toEqual(tourProps.tour);
        expect(tourWrapper.props().stepIndex).toEqual(tourProps.stepIndex);
    });

    test('Component gets registered', () => {
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('simulating clicking close button', () => {
        const myspy = jest.spyOn(Tour.prototype, 'onDone');
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.close').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });

    test('simulating clicking back button', () => {
        const myspy = jest.spyOn(Tour.prototype, 'onBack');
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.btn-default').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });

    test('simulating clicking next button', () => {
        const myspy = jest.spyOn(Tour.prototype, 'onNext');
        tourWrapper = manyWhoMount();
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.btn-primary').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });
});