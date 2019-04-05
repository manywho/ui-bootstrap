import { str, int } from '../test-utils';

import * as React from 'react';

import { shallow, mount } from 'enzyme';

import Select from '../js/components/select';

const globalAny:any = global;

jest.useFakeTimers();

const classOne = str(5);
const classTwo = str(5);

describe('Select input component behaviour', () => {

    let selectWrapper;
    let classes;
    let model;
    let state;
    let columns;
    let props;

    classes = [
        classOne,
        classTwo,
    ];

    model = {};
    state = {};

    function manyWhoMount(isDesignTime = false, objectData = [], isLoading = false, isShallow = true) {

        props = {
            isDesignTime,
            objectData,
            isLoading,
            id: 'string',
            parentId: 'string',
            flowKey: 'string',
            contentElement: <div></div>,
            hasMoreResults: true,
            onOutcome: jest.fn(),
            select: jest.fn(),
            selectAll: jest.fn(),
            clearSelection: jest.fn(),
            onSearch: jest.fn(),
            outcomes: [],
            refresh: jest.fn(),
            onNext: jest.fn(),
            onPrev: jest.fn(),
            onFirstPage: jest.fn(),
            page: 1,
            limit: 10,
            sort: jest.fn(),
            sortedBy: false,
            sortedIsAscending: 'string',
        };
        globalAny.window.manywho['utils'] = {
            debounce: jest.fn(() => {
                return jest.fn();
            }),
            isNullOrWhitespace: jest.fn(),
            isEqual: jest.fn((value1, value2, ignoreCase) => {
                return true;
            }),
        };
        globalAny.window.manywho.component['getDisplayColumns'] = jest.fn(() => columns);
        globalAny.window.manywho['styling'] = {
            getClasses: jest.fn(() => classes),
        };
        globalAny.window.manywho['state'] = {
            getComponent: jest.fn(() => state),
        };
        globalAny.window.manywho['model'] = {
            getComponent: jest.fn(() => model),
        };
        globalAny.window.manywho['formatting'] = {
            format: jest.fn((value) => {
                return value;
            }),
        };
        if (isShallow)
            return shallow(<Select {...props} />, { disableLifecycleMethods: true });

        return mount(<Select {...props} />);
    }

    afterEach(() => {
        model = {};
        state = {};
        columns = [];
        selectWrapper.unmount();
    });

    test('Select component renders without crashing', () => {
        selectWrapper = manyWhoMount();
        expect(selectWrapper.length).toEqual(1);
    });

    test('Select component gets registered', () => {
        selectWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Refresh button gets rendered when model object has objectDataRequest', () => {
        model['objectDataRequest'] = true;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.refresh-button').exists()).toEqual(true);
    });

    test('Refresh button gets rendered when model object has fileDataRequest', () => {
        model['fileDataRequest'] = true;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.refresh-button').exists()).toEqual(true);
    });

    test('Refresh button does not get rendered', () => {
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.refresh-button').exists()).toEqual(false);
    });

    test('Model classes get rendered in mark-up', () => {
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.form-group').hasClass(classOne)).toEqual(true);
        expect(selectWrapper.find('.form-group').hasClass(classTwo)).toEqual(true);
    });

    test('component has hidden class if configured to not be visible', () => {
        model['isVisible'] = false;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.form-group').hasClass('hidden')).toEqual(true);
    });

    test('component has error class if server state has error', () => {
        model['isValid'] = false;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.find('.form-group').hasClass('has-error')).toEqual(true);
    });

    test('renders server state error response in mark-up', () => {
        const errorMessage = str(10);
        state['error'] = { message: errorMessage };
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(errorMessage)).toEqual(true);
    });

    test('renders server state validation error response in mark-up', () => {
        const validationMessage = str(10);
        state['validationMessage'] = validationMessage;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(validationMessage)).toEqual(true);
    });

    test('component has correct styles', () => {
        model['width'] = 20;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.html()).toEqual(expect.stringContaining('width:20px'));
        expect(selectWrapper.html()).toEqual(expect.stringContaining('min-width:20px'));
    });
    
    test('component renders help info', () => {
        const helpInfo = str(10);
        model['helpInfo'] = helpInfo;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(helpInfo)).toEqual(true);
    });

    test('label gets rendered', () => {
        const label = str(10);
        model['label'] = label;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(label)).toEqual(true);
    });
    
    test('asterisk gets rendered if field is required', () => {
        model['isRequired'] = true;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(<span className="input-required"> * </span>)).toEqual(true);
    });

    test('options are set to component state', () => {

        const dummyContentValue1 = str(10);
        const dummyContentValue2 = str(10);
        const dummyTypeElementPropertyId = str(10);

        const objData = [
            { properties: [
                {
                    contentValue:dummyContentValue1,
                    typeElementPropertyId: dummyTypeElementPropertyId,
                    contentFormat: null,
                    contentType: 'ContentString',
                },
            ] },
            { properties: [
                { 
                    contentValue:dummyContentValue2,
                    typeElementPropertyId: dummyTypeElementPropertyId,
                    contentFormat: null,
                    contentType: 'ContentString',
                },
            ] },
        ];

        columns = [
            { typeElementPropertyId: dummyTypeElementPropertyId },
        ];

        selectWrapper = manyWhoMount(false, objData, false);
        expect(selectWrapper.state().options[0].label).toEqual(dummyContentValue1);
        expect(selectWrapper.state().options[1].label).toEqual(dummyContentValue2);
    });

    test('onValuesChange method invokes select method', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        const value = str(10);

        const options = [
            { label: str(10), value: { key: value } },
        ];
        selectInstance.onValuesChange(options);
        expect(props.select).toHaveBeenCalledWith({ key: value });
    });

    test('onValuesChange method invokes clearSelection method when no options are passed', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onValuesChange([]);
        expect(props.clearSelection).toHaveBeenCalled();
    });

    test('onValueChange method invokes select method and sets state', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        const value = str(10);

        selectInstance.onValueChange({ label: str(10), value: { key: value } });
        expect(props.select).toHaveBeenCalled();
    });

    test('onValueChange method invokes select method when no option is passed and sets state', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onValuesChange([]);
        expect(props.clearSelection).toHaveBeenCalled();
    });

    test('search string updates component state', () => {
        const searchString = str(10);
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onSearchChange(searchString);
        expect(selectWrapper.state().search).toEqual(searchString);
    });

    test('open state changes when component is loading', () => {
        const isOpen = false;
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onOpenChange(isOpen);
        expect(selectWrapper.state().isOpen).toEqual(false);
    });

    test('open state changes when component focus event is triggered', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();

        // We need to prototype this lifecycle method
        // as Enzyme does not like ReactDOM.findDOMNode
        selectInstance.componentDidUpdate = jest.fn();
        selectInstance.onFocus();
        expect(selectWrapper.state().isOpen).toEqual(true);
    });

    test('open state changes when component blur event is triggered', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onBlur();
        expect(selectWrapper.state().isOpen).toEqual(false);
    });

    test('is on page 1 select options get generated', () => {
        const typeElementPropertyId = str(10);

        columns = [
            { typeElementPropertyId },
        ];
        selectWrapper = manyWhoMount(false, [], true, false);
        const objData = [
            { properties: [
                {
                    typeElementPropertyId,
                    contentValue: str(10),
                    contentFormat: null,
                    contentType: 'ContentString',
                },
            ] },
        ];
        selectWrapper.setProps({ isLoading:false, objectData:objData });
        expect(selectWrapper.state().options.length).toEqual(1);
    });

    test('on next page that additional options are appended to option state', () => {
        const typeElementPropertyId = str(10);
        const developerName = str();

        const pageOneObjData = [
            { 
                developerName,
                externalId: str(),
                internalId: str(),
                isSelected: true,
                properties: [
                    {
                        typeElementPropertyId,
                        contentValue: str(10),
                        contentFormat: '',
                        contentType: 'ContentString',
                        developerName: 'value',
                        externalId: str(10),
                    },
                ],
            },
        ];

        const pageTwoObjData = [
            { 
                developerName,
                externalId: str(),
                internalId: str(),
                isSelected: true,
                properties: [
                    {
                        typeElementPropertyId,
                        contentValue: str(10),
                        contentFormat: '',
                        contentType: 'ContentString',
                        developerName: 'value',
                        externalId: str(10),
                    },
                ],
            },
        ];

        columns = [
            { typeElementPropertyId },
        ];

        selectWrapper = manyWhoMount(false, pageOneObjData, true, false);        

        selectWrapper.setProps({ isLoading: false, objectData: pageTwoObjData, page: 2 });
        expect(selectWrapper.state().options.length).toEqual(2);
        expect(selectWrapper.state().isOpen).toBeTruthy();
    });

    test('filterOptions always return options passed as argument', () => {
        const options = [
            {
                value: {},
                label: str(10),
            },
        ];
        selectWrapper = manyWhoMount();
        const selectWrapperInstance = selectWrapper.instance();
        expect(selectWrapperInstance.filterOptions(options)).toEqual(options);
    });

    test('getUid always returns an external ID', () => {
        const option = {
            value: {
                internalId: str(10),
            },
            label: str(10),
        };
        selectWrapper = manyWhoMount();
        const selectWrapperInstance = selectWrapper.instance();
        expect(selectWrapperInstance.getUid(option)).toEqual(option.value.internalId);
    });

    test('when isScrollLimit is called that onNext is then invoked', () => {
        const event = {
            target: {
                offsetHeight: int(6, 10),
                scrollTop: int(6, 10),
                scrollHeight: int(1, 5),
            },
        };
        selectWrapper = manyWhoMount();
        const selectWrapperInstance = selectWrapper.instance();
        selectWrapperInstance.isScrollLimit(event);
        expect(props.onNext).toHaveBeenCalled();
    });
    
});
