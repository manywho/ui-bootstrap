import * as React from 'react';
import { mount } from 'enzyme';
import TileItem from '../js/components/tile-item';

describe('Tile Item component behaviour', () => {

    let tileItemWrapper;
    const globalAny: any = global;

    const props = {
        deleteOutcome: null,
        flowKey: 'tile-item-test',
        onNext: null,
        onOutcome: null,
        onPrev: null,
        onSelect: null,
        outcomes: [],
        columns: [{
            componentType: '',
            contentFormat: null,
            contentType: 'ContentString',
            developerName: 'full_name',
            isDisplayValue: true,
            isEditable: false,
            label: 'Name',
            order: 0,
            typeElementPropertyId: '62e08e1f-0bce-42cb-922a-327f1e6e9ae7',
            typeElementPropertyToDisplayId: null,
        }, {
            componentType: '',
            contentFormat: null,
            contentType: 'ContentString',
            developerName: 'department',
            isDisplayValue: true,
            isEditable: false,
            label: 'Dept',
            order: 1,
            typeElementPropertyId: 'e5862ec0-90ce-4f01-b525-0acb876cf86e',
            typeElementPropertyToDisplayId: null,
        }, {
            componentType: '',
            contentFormat: null,
            contentType: 'ContentString',
            developerName: 'manager',
            isDisplayValue: true,
            isEditable: false,
            label: '',
            order: 2,
            typeElementPropertyId: 'cd8fcb47-4749-47c0-8f10-bed72c907cf9',
            typeElementPropertyToDisplayId: null,
        }, {
            componentType: '',
            contentFormat: null,
            contentType: 'ContentString',
            developerName: 'prof_id',
            isDisplayValue: true,
            isEditable: false,
            label: 'Prof ID',
            order: 3,
            typeElementPropertyId: 'eb410254-8ce1-48ac-a200-0f695c36711b',
            typeElementPropertyToDisplayId: null,
        }],
        item: {
            developerName: 'Professor',
            externalId: '780ba565-3da0-4d8e-a4b2-71405e67f88e',
            internalId: '7396fc71-0ddc-489d-b29f-4a65a8ff9c73',
            isSelected: false,
            order: 0,
            properties: [{
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: 'Andy',
                developerName: 'first_name',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: '401ef978-e57a-4b3d-ab63-3b4a403d6ea1',
            }, {
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: 'Tillo',
                developerName: 'last_name',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: '6bff1c8b-8b01-4ae8-943c-f3649f0c4029',
            }, {
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: '8675309',
                developerName: 'prof_id',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: 'eb410254-8ce1-48ac-a200-0f695c36711b',
            }, {
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: 'Computer Science',
                developerName: 'department',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: 'e5862ec0-90ce-4f01-b525-0acb876cf86e',
            }, {
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: 'Steve Wood',
                developerName: 'manager',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: 'cd8fcb47-4749-47c0-8f10-bed72c907cf9',
            }, {
                contentFormat: null,
                contentType: 'ContentString',
                contentValue: 'Tillo, Andy',
                developerName: 'full_name',
                objectData: [],
                typeElementId: null,
                typeElementPropertyId: '62e08e1f-0bce-42cb-922a-327f1e6e9ae7',
            }],
            typeElementId: 'f3950900-d7dc-4856-9e8f-5854b6cd1cc4',
        }
    };

    global.manywho.formatting.format.mockImplementation(contentValue => contentValue);

    function manyWhoMount() {
        return mount(< TileItem {...props} />);
    }

    afterEach(() => {
        tileItemWrapper.unmount();
    });

    test('Tile Item component renders without crashing', () => {
        tileItemWrapper = manyWhoMount();
        expect(tileItemWrapper.length).toEqual(1);
    });

    test('Tile Item component gets registered', () => {
        tileItemWrapper = manyWhoMount();
        expect(globalAny.window.manywho.component.register).toHaveBeenCalled();
    });

    test('Blank label uses developer name', () => {
        tileItemWrapper = manyWhoMount();

        expect(tileItemWrapper.props().columns[2].developerName).toEqual('manager');
        expect(tileItemWrapper.props().columns[2].label).toEqual('');
        expect(tileItemWrapper.find('li[data-developer-name="manager"]').text()).toEqual('manager: Steve Wood');
    });

    test('Label is used in preference to developer name', () => {
        tileItemWrapper = manyWhoMount();

        expect(tileItemWrapper.props().columns[3].developerName).toEqual('prof_id');
        expect(tileItemWrapper.props().columns[3].label).toEqual('Prof ID');
        expect(tileItemWrapper.find('li[data-developer-name="prof_id"]').text()).toEqual('Prof ID: 8675309');

    });
});
