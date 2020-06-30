import * as React from 'react';
import { mount } from 'enzyme';

import Navigation from '../js/components/navigation';

describe('Navigation component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    globalAny.window.manywho.engine.navigate = jest.fn();
    globalAny.window.manywho.model.getNavigation = jest.fn();

    // This is for specifying that the navigation is not
    // set to use the wizard styling
    globalAny.window.manywho.settings.global = jest.fn(() => false);

    const props = {
        isFullWidth: false,
        isFixed: false,
    };

    function manyWhoMount() {
        return mount(<Navigation {...props} />);
    }

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount();
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register)
            .toHaveBeenCalledWith('navigation', Navigation);
    });

    test('Dropdown menu gets rendered', () => {
        globalAny.window.manywho.model.getNavigation.mockImplementation(() => ({
            isVisible: true,
            items: {
                parent: {
                    id: 'parent',
                    items: {
                        test1: {
                            id: 'test1',
                            items: null,
                        },
                        test2: {
                            id: 'test2',
                            items: {
                                test3: {
                                    id: 'test3',
                                    items: null,
                                },
                            },
                        },
                    },
                },
            },
        }));

        componentWrapper = manyWhoMount();
        const dropDownMenu = componentWrapper.find('.dropdown-menu');
        expect(dropDownMenu.exists()).toBeTruthy();
    });

    test('Dropdown sub-menu gets rendered', () => {
        globalAny.window.manywho.model.getNavigation.mockImplementation(() => ({
            isVisible: true,
            items: {
                parent: {
                    id: 'parent',
                    items: {
                        test1: {
                            id: 'test1',
                            items: null,
                        },
                        test2: {
                            id: 'test2',
                            items: {
                                test3: {
                                    id: 'test3',
                                    items: {
                                        test4: {
                                            id: 'test4',
                                            items: null,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }));

        componentWrapper = manyWhoMount();
        const dropDownSubMenu = componentWrapper.find('.dropdown-submenu');
        expect(dropDownSubMenu.exists()).toBeTruthy();
    });

    test('Dropdown button displays sub menu when clicked', () => {
        globalAny.window.manywho.model.getNavigation.mockImplementation(() => ({
            isVisible: true,
            items: {
                parent: {
                    id: 'parent',
                    items: {
                        test2: {
                            id: 'test2',
                            items: null,
                        },
                    },
                },
            },
        }));


        const navWrapper = mount(<Navigation {...props} />);
        navWrapper.find('.dropdown-toggle').simulate('click');

        // Bit hacky, but its because Enzyme cannot find the node
        // by specifying "open" as the selector, as the component is
        // mutatating the dropdown button ref by calling .toggle
        expect(navWrapper.html().includes('open')).toBeTruthy();
    });

    test('Dropdown disappears once navigation complete', async () => {
        globalAny.window.manywho.engine.navigate.mockImplementation(() => {
            return Promise.resolve();
        });

        globalAny.window.manywho.model.getNavigation.mockImplementation(() => ({
            isEnabled: true,
            isVisible: true,
            items: {
                parent: {
                    id: 'parent',
                    items: {
                        sub1: {
                            id: 'abc123',
                            isEnabled: true,
                        },
                    },
                },
            },
        }));

        const navWrapper = mount(<Navigation {...props} />);

        // First, click the navigation dropdown to open it
        navWrapper.find('.dropdown-toggle').simulate('click');

        expect(navWrapper.html().includes('open')).toEqual(true);

        // Then we click the navigation item
        navWrapper.find('#abc123').simulate('click');

        // Wait until the navigation has finished, then assert the dropdown isn't open anymore
        await new Promise(setImmediate).then(() => {
            expect(navWrapper.html().includes('open')).toEqual(false);
        });
    });
});