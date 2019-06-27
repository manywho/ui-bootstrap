import { noop, str } from '../test-utils';

import * as React from 'react';

import { shallow } from 'enzyme';

import TableSmall from '../js/components/table-small';
import Outcome from '../js/components/outcome';

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
        outcomes = [{
            id: 'string',
            pageActionBindingType: '',
        }],
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

        return shallow(<TableSmall {...props} />);
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

    test('Outcome column gets rendered when there are multiple outcomes', () => {
        const outcomes = [
            { id: '1', pageActionBindingType: '' },
            { id: '2', pageActionBindingType: '' },
        ];
        const displayColumns = ['mw-outcomes'];
        const objectData = [
            {
                internalId: '0',
            },
        ];
        
        tableSmallWrapper = manyWhoMount({
            objectData,
            outcomes,
            displayColumns,
        });

        expect(tableSmallWrapper.find(Outcome).length).toBe(2);
    });

    test('renderRows gets called with objectData, outcomes and displayColumns', () => {        
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
                    internalId: '1',
                },
            ],
            objectData: [
                {
                    internalId: '0',
                },
                {
                    internalId: '1',
                },
            ],
        });

        expect(tableSmallWrapper.find('ul li').last().hasClass('active')).toBe(true);
    });

    test('internalId gets added to node as id attribute', () => {
        const internalId1 = str();
        const internalId2 = str();

        tableSmallWrapper = manyWhoMount({
            objectData: [
                {
                    internalId: internalId1,
                },
                {
                    internalId: internalId2,
                },
            ],
        });

        expect(tableSmallWrapper.find(`li#${internalId2}`).length).toBe(1);
    });

    test('internalId gets added to node as data-item attribute', () => {
        const internalId1 = str();
        const internalId2 = str();

        tableSmallWrapper = manyWhoMount({
            objectData: [
                {
                    internalId: internalId1,
                },
                {
                    internalId: internalId2,
                },
            ],
        });

        expect(tableSmallWrapper.find(`li#${internalId2}`).first().props()['data-item']).toBe(internalId2);
    });

    test('onClick gets added to rows when there is a single, non-destructive outcome', () => {
        const internalId1 = str();
        const internalId2 = str();
        const pageActionBindingType = str();

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === pageActionBindingType) {
                return false;
            }
        };
        
        tableSmallWrapper = manyWhoMount({
            outcomes: [
                {
                    pageActionBindingType,
                    id: str(),
                },
            ],
            objectData: [
                {
                    internalId: internalId1,
                },
                {
                    internalId: internalId2,
                },
            ],
        });

        expect(
            tableSmallWrapper.find(`li#${internalId2}`).first().props()['onClick'],
        ).toBe(
            tableSmallWrapper.instance().onItemClick,
        );
    });

    test('glyphicon-chevron-right gets added to rows when there is a single, non-destructive outcome', () => {
        const internalId1 = str();
        const internalId2 = str();
        const pageActionBindingType = str();

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === pageActionBindingType) {
                return false;
            }
        };
        
        tableSmallWrapper = manyWhoMount({
            outcomes: [
                {
                    pageActionBindingType,
                    id: str(),
                },
            ],
            objectData: [
                {
                    internalId: internalId1,
                },
                {
                    internalId: internalId2,
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
        const internalId1 = str();
        const internalId2 = str();

        const onRowClicked = jest.fn();
        
        tableSmallWrapper = manyWhoMount({
            onRowClicked,
            outcomes: [
                {
                    id: str(),
                    pageActionBindingType: str(),
                },
                {
                    id: str(),
                    pageActionBindingType: str(),
                },
            ],
            objectData: [
                {
                    internalId: internalId1,
                },
                {
                    internalId: internalId2,
                },
            ],
        });

        expect(
            tableSmallWrapper.find(`li#${internalId2}`).first().props()['onClick'],
        ).toBe(
            onRowClicked,
        );
    });

    test('Download anchor tags are rendered in rows when props.isFiles is true', () => {
        const internalId1 = str();
        const internalId2 = str();
        const typeElementPropertyId = str();
        const contentValue = str();
        const developerName = str();
        
        const properties = {
            filter: () => {
                return [{
                    typeElementPropertyId,
                    contentValue,
                    developerName, 
                }];
            },
        };

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === typeElementPropertyId) {
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
                    internalId: internalId1,
                },
                {
                    properties,
                    internalId: internalId2,
                },
            ],
        });

        expect(
            tableSmallWrapper.find(`li#${internalId2} a`).first().props()['href'],
        ).toBe(
            contentValue,
        );
    });

});
