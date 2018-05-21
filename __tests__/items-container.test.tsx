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

        return mount(<ItemsContainer {...props} />);
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

    test('sort method logs an error when ObjectDataRequest is null', () => {
        componentWrapper = manyWhoMount({
            objectDataRequest: null,
        });

        const testString = str(5);

        componentWrapper.instance().sort(testString);

        expect(globalAny.window.manywho.log.error).toBeCalledWith(expect.any(String));
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

});
