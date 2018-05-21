import { int } from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import Tour from '../js/components/tour';

jest.mock('react-transition-group', () => {
    const React = require('react');
    return ({
        CSSTransitionGroup: ({ children }) => <div>{children}</div>,
    });
});

jest.useFakeTimers();

declare var clearInterval: any;

describe('Tour component behaviour', () => {
    const top = int(1, 100);
    const bottom = int(1, 100);
    const left = int(1, 100);
    const right = int(1, 100);
    const width = int(1, 100);
    const height = int(1, 100);
    const x = int(1, 100);
    const y = int(1, 100);

    let tourWrapper;

    let tour = {
        id: '',
        steps: [
            {
                target: 'string',
                title: 'string',
                content: 'string',
                placement: 'left',
                showNext: true,
                showBack: true,
                offset: 20,
                align: 'top',
                order: 1,
                querySelector: true,
            },
        ],
        currentStep: 0,
    };

    const tourProps = {
        tour,
        stepIndex: 0,
    };

    const globalAny:any = global;

    function manyWhoMount(
        placement = 'left',
        align = 'top',
        offset = 20,
        title = 'title',
        next = true,
        back = true,
    ) {

        tour.steps[0].placement = placement;
        tour.steps[0].align = align;
        tour.steps[0].offset = offset;
        tour.steps[0].title = title;
        tour.steps[0].showNext = next;
        tour.steps[0].showBack = back;

        globalAny.window.manywho.tours['next'] = jest.fn();
        globalAny.window.manywho.tours['previous'] = jest.fn();
        globalAny.window.manywho.tours['done'] = jest.fn();
        globalAny.window.manywho.tours['getTargetElement'] = jest.fn(() => {
            return {
                getBoundingClientRect: jest.fn(() => {
                    return {
                        top,
                        bottom,
                        left,
                        right,
                        width,
                        height,
                        x,
                        y,
                    }; 
                }),
            };
        }),

        globalAny.window.manywho['utils'] = {
            isNullOrWhitespace: jest.fn((string) => {
                if (string === null || string === undefined) {
                    return true; 
                }
                return false;                 
            }),
            isEqual: jest.fn((positionActual, position) => {
                if (positionActual === position) {
                    return true;
                }           
                return false;
            }),
            isNullOrUndefined: jest.fn((offset) => {
                if (offset === null || offset === undefined) {
                    return true; 
                }
                return false; 
            }),
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

    test('wait half a second before onInterval is called', () => {
        const setIntervalspy = jest.spyOn(Tour.prototype, 'onInterval');
        tourWrapper = manyWhoMount();
        jest.runTimersToTime(500);
        expect(setIntervalspy).toHaveBeenCalledWith(tourProps.stepIndex);
    });

    test('unmounting component clears setInterval', () => {
        tourWrapper = manyWhoMount();
        jest.runTimersToTime(500);
        Tour.prototype.componentWillUnMount();
        expect(clearInterval.mock.calls.length).toBe(1);
    });

    test('simulating clicking close button', () => {
        tourWrapper = manyWhoMount();
        const myspy = jest.spyOn(tourWrapper.instance(), 'onDone');
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.close').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });

    test('simulating clicking back button', () => {
        tourWrapper = manyWhoMount();
        const myspy = jest.spyOn(tourWrapper.instance(), 'onBack');
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.btn-default').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });

    test('simulating clicking next button', () => {
        tourWrapper = manyWhoMount();
        const myspy = jest.spyOn(tourWrapper.instance(), 'onNext');
        tourWrapper.setState({ foundTarget: true });
        tourWrapper.find('.btn-primary').simulate('click');
        expect(myspy).toHaveBeenCalled();
    });

    test('step positioning for top of element', () => {
        const expectedTopVal = top - 0 - 16;
        const expectedCenterVal = left + (width / 2);

        tourWrapper = manyWhoMount('top', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ top:expectedTopVal, left:expectedCenterVal });
    });

    test('step positioning for bottom of element', () => {
        const expectedTopVal = bottom + 16;
        const expectedLeftVal = left + (width / 2);

        tourWrapper = manyWhoMount('bottom', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left: expectedLeftVal, top: expectedTopVal });        
    });

    test('step positioning for right of element', () => {
        const expectedTopVal = (top + (height / 2)) - (0 / 2);
        const expectedLeftVal = left - 0 - 16;

        tourWrapper = manyWhoMount('left', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left:expectedLeftVal, top:expectedTopVal });        
    });

    test('step positioning for left of element', () => {
        const expectedTopVal = (top + (height / 2)) - (0 / 2);
        const expectedLeftVal = right + 16;

        tourWrapper = manyWhoMount('right', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left:expectedLeftVal, top:expectedTopVal });        
    });

    test('arrow positioning for when offset is null/undefined', () => {
        tourWrapper = manyWhoMount('right', 'top', null);
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow').first();

        expect(arrowElement.prop('style')).toHaveProperty('top', 'calc(0% + 16px)');    
    });

    test('arrow positioning for right/left placement', () => {
        tourWrapper = manyWhoMount('right', 'top');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow').first();

        expect(arrowElement.prop('style')).toHaveProperty('top', 'calc(0% + 20px)');      
    });

    test('arrow positioning for top/bottom placement and align left', () => {
        tourWrapper = manyWhoMount('top', 'left');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow').first();

        expect(arrowElement.prop('style')).toHaveProperty('left', 'calc(0% + 20px)');     
    });

    test('arrow positioning for top/bottom placement and align right', () => {
        tourWrapper = manyWhoMount('bottom', 'right');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow').first();

        expect(arrowElement.prop('style')).toHaveProperty('left', 'calc(100% - 20px)');    
    });

    test('for no popover title if title is null', () => {
        tourWrapper = manyWhoMount('right', 'top', null, null);
        tourWrapper.setState({ foundTarget: true });

        expect(tourWrapper.find('.popover-title').exists()).toEqual(false);     
    });

    test('for no next button if showNext is false', () => {
        tourWrapper = manyWhoMount('right', 'top', null, null, false, true);
        tourWrapper.setState({ foundTarget: true });

        expect(tourWrapper.find('.btn-primary').exists()).toEqual(false);     
    });

    test('for no back button if showBack is false', () => {
        tourWrapper = manyWhoMount('right', 'top', null, null, true, false);
        tourWrapper.setState({ foundTarget: true });

        expect(tourWrapper.find('.btn-default').exists()).toEqual(false);     
    });

});
