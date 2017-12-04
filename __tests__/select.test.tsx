import testUtils from '../test-utils';

import * as React from 'react';

import { shallow } from 'enzyme';

import Select from '../js/components/select';

const globalAny:any = global;
const classOne = testUtils.generateRandomString(5);
const classTwo = testUtils.generateRandomString(5);

globalAny.reactSelectize = {
    SimpleSelect: React.createClass({
        render: () => {
            return <div></div>;
        },
    },
});

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

    function manyWhoMount(isDesignTime = false, objectData = [], isLoading = false) {

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
            debounce: jest.fn(),
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
        return shallow(<Select {...props} />, { disableLifecycleMethods: true });
    }

    afterEach(() => {
        model = {};
        state = {};
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
        const errorMessage = testUtils.generateRandomString(10);
        state['error'] = { message: errorMessage };
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(errorMessage)).toEqual(true);
    });

    test('renders server state validation error response in mark-up', () => {
        const validationMessage = testUtils.generateRandomString(10);
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
        const helpInfo = testUtils.generateRandomString(10);
        model['helpInfo'] = helpInfo;
        selectWrapper = manyWhoMount();
        expect(selectWrapper.contains(helpInfo)).toEqual(true);
    });

    test('label gets rendered', () => {
        const label = testUtils.generateRandomString(10);
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

        const dummyContentValue1 = testUtils.generateRandomString(10);
        const dummyContentValue2 = testUtils.generateRandomString(10);
        const dummyTypeElementPropertyId = testUtils.generateRandomString(10);

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
        const options = [
            { label: testUtils.generateRandomString(10), value: { foo: 'bar' } },
        ];
        selectInstance.onValuesChange(options);
        expect(props.select).toHaveBeenCalledWith({ foo: 'bar' });
    });

    test('onValuesChange method invokes clearSelection method when no options are passed', () => {
        selectWrapper = manyWhoMount();
        const selectInstance = selectWrapper.instance();
        selectInstance.onValuesChange([]);
        expect(props.clearSelection).toHaveBeenCalled();
    });
    
});
