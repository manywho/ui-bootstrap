import * as React from 'react';
import { mount } from 'enzyme';
import { str } from '../test-utils';

import ItemsContainer from '../js/components/items-container';
import Dynamic from '../js/components/dynamic';

describe('ItemsContainer component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount({
        id = str(),
        parentId = str(),
        flowKey = str(),
        isDesignTime = false,
        objectData = [],
        paginationSize = null,
        loading = null,
        page = null,
        objectDataRequest = null,
        fileDataRequest = null,
        componentType = str(),
    } = {}) {

        const props = {
            id, parentId, flowKey, isDesignTime,
        };

        globalAny.window.manywho.model.getComponent = () => ({
            objectData,
            objectDataRequest,
            fileDataRequest,
            componentType,
            attributes: {
                paginationSize,
                pagination: true,
            },
        });

        globalAny.window.manywho.state.getComponent = () => ({
            loading, page,
        });

        globalAny.window.manywho.component.contentTypes = {
            string: 'CONTENTSTRING',
            number: 'CONTENTNUMBER',
            boolean: 'CONTENTBOOLEAN',
            password: 'CONTENTPASSWORD',
            datetime: 'CONTENTDATETIME',
            content: 'CONTENTCONTENT',
            object: 'CONTENTOBJECT',
            list: 'CONTENTLIST',
        };

        return mount(<ItemsContainer {...props} />);
    }

    // Three rows of sortable data. Each row has a different ContentType with the
    // developerName's of 'boolean', 'datetime', 'encrypted', 'list', 'number', 'object',
    // 'password' and 'string'
    const sortingTestData = [
        {
            developerName: 'OneOfEach',
            isSelected: false,
            order: 0,
            properties: [
                {
                    contentFormat: '',
                    contentType: 'ContentBoolean',
                    contentValue: 'true',
                    developerName: 'boolean',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentContent',
                    contentValue: '<p>a content</p>',
                    developerName: 'content',
                    objectData: null,
                },
                {
                    contentFormat: 'dd/MM/yyyy',
                    contentType: 'ContentDateTime',
                    contentValue: '2019-05-06T16:38:00+01:00',
                    developerName: 'datetime',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentEncrypted',
                    contentValue: null,
                    developerName: 'encrypted',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentList',
                    contentValue: null,
                    developerName: 'list',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '1',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '2',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentNumber',
                    contentValue: '1',
                    developerName: 'number',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentObject',
                    contentValue: null,
                    developerName: 'object',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '10',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentPassword',
                    contentValue: 'a password',
                    developerName: 'password',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentString',
                    contentValue: 'a string',
                    developerName: 'string',
                    objectData: null,
                },
            ],
        },
        {
            developerName: 'OneOfEach',
            isSelected: false,
            order: 1,
            properties: [
                {
                    contentFormat: '',
                    contentType: 'ContentBoolean',
                    contentValue: 'false',
                    developerName: 'boolean',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentContent',
                    contentValue: '<p>b content</p>',
                    developerName: 'content',
                    objectData: null,
                },
                {
                    contentFormat: 'dd/MM/yyyy',
                    contentType: 'ContentDateTime',
                    contentValue: '2019-10-06T16:38:00+01:00',
                    developerName: 'datetime',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentEncrypted',
                    contentValue: null,
                    developerName: 'encrypted',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentList',
                    contentValue: null,
                    developerName: 'list',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '2',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '3',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentNumber',
                    contentValue: '2',
                    developerName: 'number',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentObject',
                    contentValue: null,
                    developerName: 'object',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '11',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentPassword',
                    contentValue: 'b password',
                    developerName: 'password',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentString',
                    contentValue: 'b string',
                    developerName: 'string',
                    objectData: null,
                },
            ],
        },
        {
            developerName: 'OneOfEach',
            isSelected: false,
            order: 2,
            properties: [
                {
                    contentFormat: '',
                    contentType: 'ContentBoolean',
                    contentValue: '',
                    developerName: 'boolean',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentContent',
                    contentValue: '<p>c content</p>',
                    developerName: 'content',
                    objectData: null,
                },
                {
                    contentFormat: 'dd/MM/yyyy',
                    contentType: 'ContentDateTime',
                    contentValue: '2020-05-06T16:38:00+01:00',
                    developerName: 'datetime',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentEncrypted',
                    contentValue: null,
                    developerName: 'encrypted',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentList',
                    contentValue: null,
                    developerName: 'list',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '4',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '5',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '6',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentNumber',
                    contentValue: '3',
                    developerName: 'number',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentObject',
                    contentValue: null,
                    developerName: 'object',
                    objectData: [
                        {
                            developerName: 'SimpleDimple',
                            isSelected: false,
                            order: 0,
                            properties: [
                                {
                                    contentFormat: '',
                                    contentType: 'ContentString',
                                    contentValue: '12',
                                    developerName: 'simple',
                                    objectData: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    contentFormat: '',
                    contentType: 'ContentPassword',
                    contentValue: 'c password',
                    developerName: 'password',
                    objectData: null,
                },
                {
                    contentFormat: '',
                    contentType: 'ContentString',
                    contentValue: 'c string',
                    developerName: 'string',
                    objectData: null,
                },
            ],
        },
    ];

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
            .toHaveBeenCalledWith('mw-items-container', ItemsContainer);
    });

    test('areBulkActionsDefined returns true when bulk actions present', () => {
        componentWrapper = manyWhoMount();

        const hasBulkActions = ItemsContainer.prototype.areBulkActionsDefined([
            { isBulkAction: true },
            { isBulkAction: false },
        ]);

        expect(hasBulkActions).toBe(true);
    });

    test('areBulkActionsDefined returns false when bulk actions aren\'t present', () => {
        componentWrapper = manyWhoMount();

        const hasBulkActions = ItemsContainer.prototype.areBulkActionsDefined([
            { isBulkAction: false },
            { isBulkAction: false },
        ]);

        expect(hasBulkActions).toBe(false);
    });

    test('Correct child component gets rendered', () => {
        const componentType = str();

        globalAny.window.manywho.component.getByName = jest.fn();

        componentWrapper = manyWhoMount({
            componentType,
        });

        expect(globalAny.window.manywho.component.getByName).toHaveBeenCalledWith(`mw-${componentType}`);
    });

    test('Empty items element is rendered when objectData is empty array', () => {

        globalAny.window.manywho.component.getDisplayColumns = () => [{}];

        componentWrapper = manyWhoMount({
            objectData: [],
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-empty',
                    }),
                }),
            }),
        );

    });

    test('Error element is rendered when no display columns have been defined', () => {

        globalAny.window.manywho.component.getDisplayColumns = () => [];

        componentWrapper = manyWhoMount({
            objectData: [],
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-error',
                    }),
                }),
            }),
        );

    });

    test('Error element is rendered when state has error', () => {

        globalAny.window.manywho.state.getComponent = () => ({
            error: true,
        });

        componentWrapper = manyWhoMount({
            objectData: [],
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                contentElement: expect.objectContaining({
                    props: expect.objectContaining({
                        className: 'mw-items-error',
                    }),
                }),
            }),
        );

    });

    test('Pagination size is passed to child component', () => {

        globalAny.window.manywho.utils.isEqual = () => true;

        componentWrapper = manyWhoMount({
            objectData: [],
            paginationSize: 23,
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                limit: 23,
            }),
        );

    });

    test('Pagination size is retreived from settings', () => {

        globalAny.window.manywho.utils.isEqual = () => true;
        globalAny.window.manywho.settings.flow = () => 16;

        componentWrapper = manyWhoMount({
            objectData: [],
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                limit: 16,
            }),
        );

    });

    test('id, parentId, flowKey, isDesignTime are passed directly to child component', () => {

        const id = str(4);
        const parentId = str(4);
        const flowKey = str(4);
        const isDesignTime = true;

        componentWrapper = manyWhoMount({
            id, parentId, flowKey, isDesignTime,
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                id, parentId, flowKey, isDesignTime,
            }),
        );
    });

    test('isLoading is correctly passed to child component', () => {

        componentWrapper = manyWhoMount({
            loading: true,
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                isLoading: true,
            }),
        );
    });

    test('Page number is correctly passed to child component', () => {

        componentWrapper = manyWhoMount({
            page: 42,
        });

        expect(componentWrapper.find(Dynamic).prop('props')).toEqual(
            expect.objectContaining({
                page: 42,
            }),
        );
    });

    test('sort method updates state.sortedBy property', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });

        const testString = str(5);

        componentWrapper.instance().sort(testString);

        expect(componentWrapper.state().sortedBy).toBe(testString);
    });

    test('sort method toggles state.sortedIsAscending property', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });

        const testString = str(5);

        expect(componentWrapper.state().sortedIsAscending).toBe(null);

        componentWrapper.instance().sort(testString);

        expect(componentWrapper.state().sortedIsAscending).toBe(true);

        componentWrapper.instance().sort(testString);

        expect(componentWrapper.state().sortedIsAscending).toBe(false);
    });

    test('sort method toggles state.sortedIsAscending property when ObjectDataRequest is null', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const testString = str(5);

        expect(componentWrapper.state().sortedIsAscending).toBe(null);

        componentWrapper.instance().sort(testString);
        expect(componentWrapper.state().sortedIsAscending).toBe(true);

        componentWrapper.instance().sort(testString);
        expect(componentWrapper.state().sortedIsAscending).toBe(false);
    });

    test('search method resets sorting state', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const testString = str(5);

        componentWrapper.instance().sort(str);
        componentWrapper.instance().search(testString, false);

        expect(componentWrapper.state().sortedIsAscending).toBe(null);
        expect(componentWrapper.state().sortedBy).toBe(null);
    });

    test('search method clears selection when clearSelection param is true', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const clearSpy = jest.spyOn(componentWrapper.instance(), 'clearSelection');

        componentWrapper.instance().search('', true);

        expect(clearSpy).toBeCalledWith(false);
    });

    test('search is cleared when clearSelection is called with true param', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const setComponentSpy = globalAny.window.manywho.state.setComponent = jest.fn();

        componentWrapper.instance().search(str(5), true);
        componentWrapper.instance().clearSelection(true);

        expect(setComponentSpy).toBeCalledWith(
            expect.anything(),
            expect.objectContaining({
                search: null,
            }),
            expect.anything(),
            expect.anything(),
        );
    });

    test('component.onOutcome gets called within instance onOutcome method', () => {
        componentWrapper = manyWhoMount();

        componentWrapper.instance().onOutcome(
            str(4),
            str(4),
        );

        expect(globalAny.window.manywho.component.onOutcome).toBeCalled();
    });

    test('load method calls manywho.engine.objectDataRequest if model.objectDataRequest is present', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: {},
        });

        componentWrapper.instance().load();

        expect(globalAny.window.manywho.engine.objectDataRequest).toBeCalled();
    });

    test('load method calls manywho.engine.fileDataRequest if model.fileDataRequest is present', () => {
        componentWrapper = manyWhoMount({
            fileDataRequest: {},
        });

        componentWrapper.instance().load();

        expect(globalAny.window.manywho.engine.fileDataRequest).toBeCalled();
    });

    test('load method forces update if model.objectDataRequest and model.fileDataRequest are falsy', () => {
        componentWrapper = manyWhoMount();

        const forceUpdateSpy = jest.spyOn(componentWrapper.instance(), 'forceUpdate');

        componentWrapper.instance().load();

        expect(forceUpdateSpy).toBeCalled();
    });

    test('onNext calls onPaginate with next page number', () => {
        const onPaginateSpy = jest.spyOn(ItemsContainer.prototype, 'onPaginate');

        componentWrapper = manyWhoMount();

        globalAny.window.manywho.state.getComponent = () => ({ page: 3 });

        componentWrapper.instance().onNext();

        expect(onPaginateSpy).toBeCalledWith(4);
    });

    test('onPrev calls onPaginate with previous page number', () => {
        const onPaginateSpy = jest.spyOn(ItemsContainer.prototype, 'onPaginate');

        componentWrapper = manyWhoMount();

        globalAny.window.manywho.state.getComponent = () => ({ page: 3 });

        componentWrapper.instance().onPrev();

        expect(onPaginateSpy).toBeCalledWith(2);
    });

    test('onFirstPage calls onPaginate with 1', () => {
        const onPaginateSpy = jest.spyOn(ItemsContainer.prototype, 'onPaginate');

        componentWrapper = manyWhoMount();

        globalAny.window.manywho.state.getComponent = () => ({ page: 3 });

        componentWrapper.instance().onFirstPage();

        expect(onPaginateSpy).toBeCalledWith(1);
    });

    test('Check sorting empty array does not crash', () => {
        componentWrapper = manyWhoMount();

        const empty = [];
        empty.sort(componentWrapper.instance().compare('', true));
        expect(empty.length).toBe(0);

        empty.sort(componentWrapper.instance().compare('', false));
        expect(empty.length).toBe(0);
    });

    test('Check sorting a single item does nothing', () => {
        componentWrapper = manyWhoMount();

        const single = [
            {
                developerName: 'OneRow',
                isSelected: false,
                order: 0,
                properties: [
                    {
                        contentFormat: '',
                        contentType: 'ContentString',
                        contentValue: 'my value',
                        developerName: 'stuff',
                        objectData: null,
                    },
                ],
            },
        ];
        const objectData = Object.assign([], single);

        objectData.sort(componentWrapper.instance().compare('stuff', true));
        expect(objectData).toEqual(single);
        objectData.sort(componentWrapper.instance().compare('descending stuff', false));
        expect(objectData).toEqual(single);
    });

    test('Sanity check for our test sorting data', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        expect(objectData.length).toEqual(3);
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);
    });

    test('Unknown sort key leaves order intact', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        objectData.sort(componentWrapper.instance().compare('no such key', true));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);
        objectData.sort(componentWrapper.instance().compare('no such key', false));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);
    });

    test('Verify sort method handles contentType:string', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        objectData.sort(componentWrapper.instance().compare('string', false));
        expect(objectData[0].order).toEqual(2);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(0);
        objectData.sort(componentWrapper.instance().compare('string', true));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);

        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:password', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        objectData.sort(componentWrapper.instance().compare('password', false));
        expect(objectData[0].order).toEqual(2);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(0);
        objectData.sort(componentWrapper.instance().compare('password', true));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);

        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:datetime', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        objectData.sort(componentWrapper.instance().compare('datetime', false));
        expect(objectData[0].order).toEqual(2);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(0);
        objectData.sort(componentWrapper.instance().compare('datetime', true));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);

        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:number', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        objectData.sort(componentWrapper.instance().compare('number', false));
        expect(objectData[0].order).toEqual(2);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(0);
        objectData.sort(componentWrapper.instance().compare('number', true));
        expect(objectData[0].order).toEqual(0);
        expect(objectData[1].order).toEqual(1);
        expect(objectData[2].order).toEqual(2);

        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:boolean', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        // The compare() method treats 'true' as true and any other value as false, so only two unique values
        // are sorted which means the result of sorting these three rows is non-deterministic
        // All 'true' values should be first for an ASC sort and last for a DESC sort.
        objectData.sort(componentWrapper.instance().compare('boolean', false));
        expect(['false', '']).toContain(objectData[0].properties[0].contentValue);
        expect(['false', '']).toContain(objectData[1].properties[0].contentValue);
        expect(objectData[2].properties[0].contentValue).toEqual('true');
        objectData.sort(componentWrapper.instance().compare('boolean', true));
        expect(objectData[0].properties[0].contentValue).toEqual('true');
        expect(['false', '']).toContain(objectData[1].properties[0].contentValue);
        expect(['false', '']).toContain(objectData[2].properties[0].contentValue);
    });

    test('Verify sort method handles contentType:encrypted', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        // Nothing should happen as we can not sort this type of data
        objectData.sort(componentWrapper.instance().compare('encrypted', false));
        expect(objectData).toEqual(sortingTestData);
        objectData.sort(componentWrapper.instance().compare('encrypted', true));
        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:list', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        // Nothing should happen as we can not compare lists
        objectData.sort(componentWrapper.instance().compare('list', false));
        expect(objectData).toEqual(sortingTestData);
        objectData.sort(componentWrapper.instance().compare('list', true));
        expect(objectData).toEqual(sortingTestData);
    });

    test('Verify sort method handles contentType:object', () => {
        componentWrapper = manyWhoMount();
        const objectData = Object.assign([], sortingTestData);

        // Nothing should happen as we can not compare user defined objects
        objectData.sort(componentWrapper.instance().compare('object', false));
        expect(objectData).toEqual(sortingTestData);
        objectData.sort(componentWrapper.instance().compare('object', true));
        expect(objectData).toEqual(sortingTestData);
    });
});
