import { noop } from '../test-utils';

import * as React from 'react';

import { mount } from 'enzyme';

import TableSmall from '../js/components/table-small';

describe('Table Small input component behaviour', () => {

    let tableSmallWrapper;

    const globalAny:any = global;

    function manyWhoMount({
        id = 'string',
        parentId = 'string',
        flowKey = 'string',
        onOutcome = jest.fn(),
        isValid = true,
        objectData = [],
        outcomes = [{ id: 'string' }],
        selectedRows = [],
        displayColumns = [],
        onRowClicked = noop,
        isFiles = false,
    } = {}) {

        const props = {
            id, parentId, flowKey, onOutcome, isValid, 
            objectData, outcomes, displayColumns, selectedRows,
            onRowClicked, isFiles,
        };

        return mount(<TableSmall {...props} />);
    }

    afterEach(() => {
        tableSmallWrapper.unmount();
    });

    test('Table Small component renders without crashing', () => {
        tableSmallWrapper = manyWhoMount();
        expect(tableSmallWrapper.length).toEqual(1);
    });

    test('Table Small component gets registered', () => {
        tableSmallWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('renedrRows gets called with objectData, outcomes and displayColumns', () => {        
        const objectData = [];
        const outcomes = [];
        const displayColumns = [];
        
        tableSmallWrapper = manyWhoMount({
            objectData, outcomes, displayColumns,
        });

        const renderRowSpy = jest.spyOn(tableSmallWrapper.instance(), 'renderRows');

        tableSmallWrapper.instance().render();

        expect(renderRowSpy).toHaveBeenCalledWith(
            objectData, outcomes, displayColumns,
        );
    });

    test('table-invalid CSS class is appended when isValid prop is false', () => {
        tableSmallWrapper = manyWhoMount({
            isValid: false,
        });

        expect(tableSmallWrapper.find('.table-invalid').length).toBe(1);
    });

    test('Matched selected row gets selected', () => {

        globalAny.window.manywho.utils.isEqual = (a, b) => {
            if (a === '1' && b === '1') {
                return true;
            }
        };

        tableSmallWrapper = manyWhoMount({
            selectedRows: [
                {
                    externalId: '1',
                },
            ],
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: '1',
                },
            ],
        });

        expect(tableSmallWrapper.find('ul li').last().hasClass('active')).toBe(true);
    });

    test('externalId gets added to node as id attribute', () => {

        tableSmallWrapper = manyWhoMount({
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: 'abc',
                },
            ],
        });

        expect(tableSmallWrapper.find('li#abc').length).toBe(1);
    });

    test('externalId gets added to node as data-item attribute', () => {

        tableSmallWrapper = manyWhoMount({
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: 'abc',
                },
            ],
        });

        expect(tableSmallWrapper.find('li#abc').first().props()['data-item']).toBe('abc');
    });

    test('onClick gets added to rows when there is a single, non-destructive outcome', () => {

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === 'x') {
                return false;
            }
        };
        
        tableSmallWrapper = manyWhoMount({
            outcomes: [
                {
                    id: 'abc',
                    pageActionBindingType: 'x',
                },
            ],
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: 'abc',
                },
            ],
        });

        expect(
            tableSmallWrapper.find('li#abc').first().props()['onClick'],
        ).toBe(
            tableSmallWrapper.instance().onItemClick,
        );
    });

    test('glyphicon-chevron-right gets added to rows when there is a single, non-destructive outcome', () => {

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === 'x') {
                return false;
            }
        };
        
        tableSmallWrapper = manyWhoMount({
            outcomes: [
                {
                    id: 'abc',
                    pageActionBindingType: 'x',
                },
            ],
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: 'abc',
                },
            ],
        });

        expect(
            tableSmallWrapper.find('.glyphicon-chevron-right').length,
        ).toBe(
            2,
        );
    });

    test('props.onRowClicked gets added to rows when there isn\'t a single outcome', () => {

        const onRowClicked = jest.fn();
        
        tableSmallWrapper = manyWhoMount({
            onRowClicked,
            outcomes: [
                {
                    id: 'abc',
                },
                {
                    id: 'def',
                },
            ],
            objectData: [
                {
                    externalId: '0',
                },
                {
                    externalId: 'abc',
                },
            ],
        });

        expect(
            tableSmallWrapper.find('li#abc').first().props()['onClick'],
        ).toBe(
            onRowClicked,
        );
    });

    test('Download anchor tags are rendered in rows when props.isFiles is true', () => {
        
        const properties = {
            filter: () => {
                return [{
                    typeElementPropertyId: 'x',
                    contentValue: 'yyy',
                }];
            },
        };

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === 'x') {
                return true;
            }
        };
        
        tableSmallWrapper = manyWhoMount({
            isFiles: true,
            displayColumns: [
                {},
            ],
            objectData: [
                {
                    properties,
                    externalId: '0',
                },
                {
                    properties,
                    externalId: 'abc',
                },
            ],
        });

        expect(
            tableSmallWrapper.find('li#abc a').first().props()['href'],
        ).toBe(
            'yyy',
        );
    });

});
