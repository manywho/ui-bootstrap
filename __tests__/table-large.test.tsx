import { str } from '../test-utils';

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
                isMultiSelect: false,
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
        if (tableLargeWrapper && !tableLargeWrapper.isEmpty()) {
            tableLargeWrapper.unmount();
        }
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
                isMultiSelect: false,
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
                isMultiSelect: false,
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
                isMultiSelect: false,
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
        const a = str();
        const b = str();
        const c = str();
        const d = str();

        globalAny.window.manywho.utils.isEqual = (a, b) => a === b;
        
        const objectData = [
            {
                internalId: a,
                properties: [
                    {
                        typeElementPropertyId: b, // only this one should match
                    },
                    {
                        typeElementPropertyId: c,
                    },
                ],
            },
            {
                internalId: c,
                properties: [
                    {
                        typeElementPropertyId: b,
                    },
                ],
            },
        ];

        const setObjectData = TableLarge.prototype.setPropertyValue(objectData, a, b, d);

        expect(setObjectData).toEqual([
            {
                internalId: a,
                properties: [
                    {
                        typeElementPropertyId: b,
                        contentValue: d,
                    },
                    {
                        typeElementPropertyId: c,                        
                    },
                ],
            },
            {
                internalId: c,
                properties: [
                    {
                        typeElementPropertyId: b,
                    },
                ],
            },
        ]);
    });
    
    test('isTableEditable returns true when any column.isEditable is true', () => {
        
        const columns = [
            {
                isEditable: false,
                typeElementPropertyId: str(),
            },
            {
                isEditable: true,
                typeElementPropertyId: str(),
            },
        ];

        const tableIsEditable = TableLarge.prototype.isTableEditable(columns);

        expect(tableIsEditable).toBe(true);
    });
    
    test('onOutcomeClick is passed to outcomes in outcome column', () => {
        
        const displayColumns = ['mw-outcomes'];

        const objectData = [
            {
                externalId: str(),
                typeElementPropertyId: str(),
            },
            {
                externalId: str(),
                typeElementPropertyId: str(),
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
                onClick: tableLargeWrapper.instance().onOutcomeClick,
            }),
        );
    });

    test('Download anchor tags are rendered in rows when props.isFiles is true', () => {

        const contentValue = str();
        const typeElementPropertyId = str();
        const internalId1 = str();
        const internalId2 = str();
        
        const properties = {
            find: () => ({
                contentValue,
                typeElementPropertyId,
                objectData: [],
            }),
        };

        globalAny.window.manywho.utils.isEqual = (a) => {
            if (a === typeElementPropertyId) {
                return true;
            }
        };
        
        tableLargeWrapper = manyWhoMount({
            isFiles: true,
            displayColumns: [
                { typeElementPropertyId: str() },
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
            tableLargeWrapper.find(`#${internalId2} a`).first().props()['href'],
        ).toBe(
            contentValue,
        );
    });

    test('Checkbox column is rendered when model.isMultiSelect is true', () => {

        const contentValue = str();
        const typeElementPropertyId = str();
        const externalId1 = str();
        const externalId2 = str();
        
        const properties = {
            find: () => ({
                typeElementPropertyId,
                contentValue,
                objectData: [],
            }),
        };
        
        tableLargeWrapper = manyWhoMount(
            {
                model: {
                    attributes: {
                        borderless: false,
                        striped: false,
                    },
                    isValid: true,
                    isMultiSelect: true,
                },
                displayColumns: [
                    { 
                        typeElementPropertyId,
                        label: str(),
                    },
                ],
                objectData: [
                    {
                        properties,
                        externalId: externalId1,
                    },
                    {
                        properties,
                        externalId: externalId2,
                    },
                ],
            },
            true,
        );

        expect(
            tableLargeWrapper.find('.checkbox-cell').length,
        ).toBe(
            3,
        );
    });

});
