import testUtils from '../test-utils';

import * as React from 'react';

import { mount, shallow } from 'enzyme';

import TableLarge from '../js/components/table-large';
import Outcome from '../js/components/outcome';

describe('Table Large input component behaviour', () => {

    let tableLargeWrapper;

    const globalAny:any = global;

    function manyWhoMount(
        {
            id = 'string',
            parentId = 'string',
            flowKey = 'string',
            model = {
                attributes: {
                    borderless: false,
                    striped: false,
                },
                isValid: true,
            },
            objectData = [],   
            selectedRows = [{ 
                externalId: 'string',
            }],
            totalObjectData = {},
            onHeaderClick = jest.fn(),
            onRowClicked = jest.fn(),
            outcomes = [{ 
                id: 'string',
            }],
            onOutcome = jest.fn(),
            isFiles = true,
            displayColumns = [],
            sortedBy = 'string',
            sortedIsAscending = true,
            isSelectionEnabled = true,
            onSelect = jest.fn(),
            selectAll = jest.fn(),
        } = {},
        shallowRender = false,
    ) {

        const props = {
            id,
            parentId,
            flowKey,
            model,
            objectData,
            selectedRows,
            totalObjectData,
            onHeaderClick,
            onRowClicked,
            outcomes,
            onOutcome,
            isFiles,
            displayColumns,
            sortedBy,
            sortedIsAscending,
            isSelectionEnabled,
            onSelect,
            selectAll,
        };

        return shallowRender ? shallow(<TableLarge {...props} />) : mount(<TableLarge {...props} />);
    }

    afterEach(() => {
        tableLargeWrapper.unmount();
    });

    test('Table Large component renders without crashing', () => {
        tableLargeWrapper = manyWhoMount();
        expect(tableLargeWrapper.length).toEqual(1);
    });

    test('Table Large component gets registered', () => {
        tableLargeWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Table has table-invalid CSS class when props.model.isValid is false', () => {
        
        tableLargeWrapper = manyWhoMount({
            model: {
                attributes: {
                    borderless: true,
                    striped: true,
                },
                isValid: false,
            },
        });
        
        expect(tableLargeWrapper.find('.table-invalid').length).toBe(1);
    });

    test('Table has table-bordered CSS class when props.model.attributes.borderless is not true', () => {
        
        globalAny.window.manywho.utils.isEqual = (a, b) => a === true && b === 'true';
        
        tableLargeWrapper = manyWhoMount({
            model: {
                attributes: {
                    borderless: false,
                    striped: true,
                },
                isValid: true,
            },
        });

        expect(tableLargeWrapper.find('.table-bordered').length).toBe(1);
    });

    test('Table has table-striped CSS class when props.model.attributes.striped is true', () => {
        
        globalAny.window.manywho.utils.isEqual = (a, b) => a === true && b === 'true';
        
        tableLargeWrapper = manyWhoMount({
            model: {
                attributes: {
                    borderless: true,
                    striped: true,
                },
                isValid: false,
            },
        });

        expect(tableLargeWrapper.find('.table-striped').length).toBe(1);
    });

    test('Table has table-hover CSS class when props.isSelectionEnabled is true', () => {

        tableLargeWrapper = manyWhoMount({
            isSelectionEnabled: true,
        });

        expect(tableLargeWrapper.find('.table-hover').length).toBe(1);
    });

    test('setPropertyValue sets the correct property as the given value on each objectData', () => {

        globalAny.window.manywho.utils.isEqual = (a, b) => a === b;
        
        const objectData = [
            {
                externalId: 'yyy',
                properties: [
                    {
                        typeElementPropertyId: 'xxx', // only this one should match
                    },
                    {
                        typeElementPropertyId: 'a',
                    },
                ],
            },
            {
                externalId: 'a',
                properties: [
                    {
                        typeElementPropertyId: 'xxx',
                    },
                ],
            },
        ];

        const setObjectData = TableLarge.prototype.setPropertyValue(objectData, 'yyy', 'xxx', 'abc');

        expect(setObjectData).toEqual([
            {
                externalId: 'yyy',
                properties: [
                    {
                        typeElementPropertyId: 'xxx',
                        contentValue: 'abc',
                    },
                    {
                        typeElementPropertyId: 'a',                        
                    },
                ],
            },
            {
                externalId: 'a',
                properties: [
                    {
                        typeElementPropertyId: 'xxx',
                    },
                ],
            },
        ]);
    });
    
    test('isTableEditable returns true when any column.isEditable is true', () => {
        
        const columns = [
            {
                isEditable: false,
            },
            {
                isEditable: true,
            },
        ];

        const tableIsEditable = TableLarge.prototype.isTableEditable(columns);

        expect(tableIsEditable).toBe(true);
    });
    
    test('onOutcomeClick is passed to outcomes in outcome column', () => {
        
        const displayColumns = ['mw-outcomes'];

        const objectData = [
            {
                externalId: 'a',
            },
            {
                externalId: 'b',
            },
        ];

        tableLargeWrapper = manyWhoMount(
            {
                displayColumns,
                objectData,
            }, 
            true,
        );

        expect(
            tableLargeWrapper.find('td.table-outcome-column').first().find(Outcome).first().props(),
        ).toEqual(
            expect.objectContaining({
                onClick: TableLarge.prototype.onOutcomeClick,
            }),
        );
    });

    test('Download anchor tags are rendered in rows when props.isFiles is true', () => {
        
        const properties = {
            find: () => ({
                typeElementPropertyId: 'x',
                contentValue: 'yyy',
                objectData: [],
            }),
        };

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === 'x') {
                return true;
            }
        };
        
        tableLargeWrapper = manyWhoMount({
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
            tableLargeWrapper.find('#abc a').first().props()['href'],
        ).toBe(
            'yyy',
        );
    });

});
