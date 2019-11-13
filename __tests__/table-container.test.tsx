import { str, int } from '../test-utils';

import * as React from 'react';

import { shallow } from 'enzyme';

import Table from '../js/components/table-container';
import Pagination from '../js/components/pagination';
import FileUpload from '../js/components/file-upload';
import TableSmall from '../js/components/table-small';
import TableLarge from '../js/components/table-large';
import ItemsHeader from '../js/components/items-header';

describe('Table component behaviour', () => {

    const globalAny:any = global;

    let tableWrapper;
    let props;
    let model;

    function manyWhoMount(isVisible = true, isValid = true, isEditable = false) {

        props = {
            id: 'string',
            parentId: 'string',
            flowKey: 'string',
            items: [],
            isDesignTime: false,
            children: false,
            sort: jest.fn(),
            select: jest.fn(),
            // This objectData looks very ugly but helps to fix the tests so
            // the TableSmall or TableLarge get rendered and can be tested
            // against.
            objectData: [
                {
                    properties: [
                        {
                            objectData: [
                                {
                                    properties: [
                                        { typeElementPropertyId: 1 },
                                    ],
                                },
                            ],
                            typeElementPropertyId: 1,
                        },
                    ],
                },
            ],
            sortedBy: 'string',
            sortedIsAscending: true,
            onOutcome: jest.fn(),
            selectAll: jest.fn(),
            contentElement: null,
            isLoading: true,
            onSearch: jest.fn(),
            refresh: jest.fn(),
            page: 10,
            onFirstPage: jest.fn(),
            pageIndex: 10,
            onPrev: jest.fn(),
            onNext: jest.fn(),
            hasMoreResults: true,
        };

        model = {
            isVisible,
            isValid,
            fileDataRequest: {},
            label: str(10),
            attributes: {
                classes: str(10),
            },
            columns: [
                {
                    typeElementPropertyId: 1,
                    isEditable,
                },
            ],
        };

        globalAny.window.manywho.utils = {
            debounce: jest.fn(),
            isEqual: jest.fn(),
            isNullOrWhitespace: jest.fn(),
            isNullOrUndefined: jest.fn(),
            extend: jest.fn(properties => properties),
            extractTenantId: jest.fn(() => str(10)),
        };
        globalAny.window.manywho.model.getOutcomes = jest.fn(() => []);
        globalAny.window.manywho.state.getAuthenticationToken = jest.fn(() => str(10));
        globalAny.window.manywho.ajax = {
            uploadFile: jest.fn(() => str(10)),
        };
        globalAny.window.manywho.state.getComponent = jest.fn(() => ({ search: str(10) }));
        globalAny.window.manywho.engine = {
            fileDataRequest: jest.fn(),
        };
        globalAny.window.manywho.model.getComponent = jest.fn(() => model);
        globalAny.window.manywho.component.getByName = jest.fn((component) => {

            switch (component) {

            case 'mw-pagination':
                return Pagination;

            case 'file-upload':
                return FileUpload;

            case 'mw-table-large':
                return TableLarge;

            case 'mw-table-small':
                return TableSmall;

            case 'mw-items-header':
                return ItemsHeader;

            default:
                return null; // returning just a div was breaking the tests
            }
        });
        globalAny.window.manywho.component.getDisplayColumns = jest.fn(columns => columns);
        globalAny.window.manywho.styling.getClasses = jest.fn(() => [model.attributes.classes]);

        return shallow(<Table {...props} />, { disableLifecycleMethods: true });
    }

    afterEach(() => {
        tableWrapper.unmount();
    });

    test('Table component renders without crashing', () => {
        tableWrapper = manyWhoMount();
        expect(tableWrapper.length).toEqual(1);
    });

    test('Table component gets registered', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.registerItems).toHaveBeenCalledTimes(2);
    });

    test('Initial state properties are set with expected values', () => {
        const expectedState = {
            isVisible: true,
            height: null,
            icon: 'toggle-icon glyphicon glyphicon-triangle-bottom',
            windowWidth: 1024,
            sortByOrder: 'ASC',
            lastOrderBy: '',
            objectData: null,
        };
        tableWrapper = manyWhoMount();
        expect(tableWrapper.state()).toEqual(expectedState);
    });

    test('Table Large gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-table-large');
        expect(tableWrapper.exists(TableSmall)).toEqual(false);
        expect(tableWrapper.exists(TableLarge)).toEqual(true);
    });

    test('Table Small gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        tableWrapper.setState({ windowWidth: int(100, 500) });
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-table-small');
        expect(tableWrapper.exists(TableSmall)).toEqual(true);
        expect(tableWrapper.exists(TableLarge)).toEqual(false);
    });

    test('Table Large gets rendered below 768px if any table columns are editable', () => {
        tableWrapper = manyWhoMount(true, true, true);
        tableWrapper.setState({ windowWidth: int(100, 500) });
        expect(tableWrapper.exists(TableSmall)).toEqual(false);
        expect(tableWrapper.exists(TableLarge)).toEqual(true);
    });

    test('if window inner width is less than 768px then small tables class gets applied to rendered markup', () => {
        tableWrapper = manyWhoMount();
        tableWrapper.setState({ windowWidth: int(100, 500) });
        expect(tableWrapper.find('.table-container-small').exists()).toEqual(true);
    });

    test('File Upload gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('file-upload');
    });

    test('Items Header gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-items-header');
    });

    test('Pagination gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('mw-pagination');
    });

    test('Loader gets rendered as a child component', () => {
        tableWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith('wait');
    });

    test('hidden class gets applied to rendered markup', () => {
        tableWrapper = manyWhoMount(false);
        expect(tableWrapper.find('.hidden').exists()).toEqual(true);
        tableWrapper.setState({ isVisible: false });
        expect(tableWrapper.find('.clearfix').hasClass('hidden')).toEqual(true);
    });

    test('help block gets rendered', () => {
        tableWrapper = manyWhoMount(true, false);
        expect(tableWrapper.find('.has-error').exists()).toEqual(true);
    });

    test('label gets rendered', () => {
        tableWrapper = manyWhoMount();
        expect(tableWrapper.find('label').prop('children')).toEqual(expect.stringContaining(model.label));
    });

    test('model class attribute get rendered as html classes', () => {
        tableWrapper = manyWhoMount();
        expect(tableWrapper.prop('className')).toEqual(expect.stringContaining(model.attributes.classes));
    });

    test('table columns to be displayed are returned', () => {
        tableWrapper = manyWhoMount(true, true, true);
        const tableWrapperInstance = tableWrapper.instance();
        const tableColumns = [
            {
                contentType: 'ContentString',
                label: str(10),
            },
            {
                contentType: 'ContentString',
                label: str(10),
            },
        ];
        expect(tableWrapperInstance.getDisplayColumns(tableColumns, [])).toEqual(tableColumns);
    });

    test('if outcomes with property isBulkAction then add mw-outcomes to disply column array', () => {
        tableWrapper = manyWhoMount(true, true, true);
        const tableWrapperInstance = tableWrapper.instance();
        const tableColumns = [
            {
                contentType: 'ContentString',
                label: str(10),
            },
            {
                contentType: 'ContentString',
                label: str(10),
            },
        ];

        const outcomes = [
            {
                contentType: 'ContentString',
                label: str(10),
            },
            {
                contentType: 'ContentString',
                label: str(10),
                isBulkAction: true,
            },
        ];

        expect(tableWrapperInstance.getDisplayColumns(tableColumns, outcomes)).toContain('mw-outcomes');
    });

    test('footer renders with pagination', () => {
        tableWrapper = manyWhoMount(true, true, true);

        const mockArgs = {
            pageIndex: 2,
            hasMoreResults: false,
            onNext: jest.fn(),
            onPrev: jest.fn(),
            onFirstPage: jest.fn(),
            isDesignTime: false,
        };

        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.renderFooter(mockArgs);
        expect(globalAny.window.manywho.component.getByName).toBeCalledWith('mw-pagination');
    });

    test('footer renders with no pagination', () => {
        tableWrapper = manyWhoMount(true, true, true);

        const mockArgs = {
            pageIndex: 1,
            hasMoreResults: false,
            onNext: jest.fn(),
            onPrev: jest.fn(),
            onFirstPage: jest.fn(),
            isDesignTime: false,
        };

        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.renderFooter(mockArgs);
        expect(tableWrapperInstance.renderFooter(mockArgs)).toBeNull();
    });

    test('header click calls sort function from component props', () => {
        tableWrapper = manyWhoMount(true, true, true);

        const mockEvent = {
            currentTarget: {
                id: str(10),
                dataset: {
                    sortProperty: str(10),
                },
            },
        };

        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.onHeaderClick(mockEvent);
        expect(props.sort).toBeCalledWith(mockEvent.currentTarget.dataset.sortProperty);
    });

    test('onSelect calls select function from component props', () => {
        tableWrapper = manyWhoMount(true, true, true);

        const mockEvent = {
            stopPropagation: jest.fn(),
            currentTarget: {
                id: str(10),
            },
        };

        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.onSelect(mockEvent);
        expect(props.select).toBeCalledWith(mockEvent.currentTarget.id);
    });

    test('window resize updates component state to window inner width', () => {
        tableWrapper = manyWhoMount(true, true, true);
        tableWrapper.setState({ windowWidth: int(100, 500) });
        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.handleResize();
        expect(tableWrapper.state().windowWidth).toEqual(1024);
    });

    test('manyWho core function gets called when file has finished uploading', () => {
        tableWrapper = manyWhoMount(true, true, true);
        const tableWrapperInstance = tableWrapper.instance();
        tableWrapperInstance.fetchFiles();
        expect(globalAny.window.manywho.engine.fileDataRequest).toHaveBeenCalled();
    });

});
