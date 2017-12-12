

import * as React from 'react';

import { mount } from 'enzyme';

import Tour from '../js/components/tour';

jest.mock('react-transition-group/CSSTransitionGroup', () => {
    return {
        default: 'CSSTransitionGroup',
    };
});

jest.useFakeTimers();

describe('Tour component behaviour', () => {

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
                        top: 100,
                        bottom: 100,
                        left: 100,
                        right: 100,
                        width: 100,
                        height: 100,
                        x: 100,
                        y: 100,
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

    test('step positioning for top of element', () => {
        tourWrapper = manyWhoMount('top', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ top:84, left:150 });
    });

    test('step positioning for bottom of element', () => {
        tourWrapper = manyWhoMount('bottom', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left: 150, top: 116 });        
    });

    test('step positioning for right of element', () => {
        tourWrapper = manyWhoMount('left', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left:84, top:150 });        
    });

    test('step positioning for left of element', () => {
        tourWrapper = manyWhoMount('right', 'center');
        tourWrapper.setState({ foundTarget: true });
        expect(tourWrapper.state().style).toEqual({ left:116, top:150 });        
    });

    test('arrow positioning for when offset is null/undefined', () => {
        tourWrapper = manyWhoMount('right', 'top', null);
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow');

        expect(arrowElement.html());
        expect(arrowElement.html()).toEqual(expect.stringContaining('calc(0% + 16px)'));    
    });

    test('arrow positioning for right/left placement', () => {
        tourWrapper = manyWhoMount('right', 'top');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow');

        expect(arrowElement.html());
        expect(arrowElement.html()).toEqual(expect.stringContaining('calc(0% + 20px)'));    
    });

    test('arrow positioning for top/bottom placement and align left', () => {
        tourWrapper = manyWhoMount('top', 'left');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow');

        expect(arrowElement.html());
        expect(arrowElement.html()).toEqual(expect.stringContaining('calc(0% + 20px)'));       
    });

    test('arrow positioning for top/bottom placement and align right', () => {
        tourWrapper = manyWhoMount('bottom', 'right');
        tourWrapper.setState({ foundTarget: true });
        const arrowElement = tourWrapper.find('.arrow');

        expect(arrowElement.html());
        expect(arrowElement.html()).toEqual(expect.stringContaining('calc(100% - 20px)'));       
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
