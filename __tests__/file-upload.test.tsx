import * as React from 'react';
import { shallow } from 'enzyme';

import FileUpload, { uploadComplete } from '../js/components/file-upload';

describe('FileUpload component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    globalAny.window.manywho.ajax = {
        uploadFiles: jest.fn(),
    };

    globalAny.window.manywho.utils = {
        extractTenantId: x => 1.5 * x,
        extractStateId: x => 3 * x,
        isNullOrUndefined: (value: any): boolean => typeof value === 'undefined' || value === null,
        isNullOrWhitespace: (value: string): boolean => {
            if (typeof value === 'undefined' || value === null) {
                return true;
            }
    
            return value.replace(/\s/g, '').length < 1;
        },
    };
    
    globalAny.window.manywho.state = {
        getAuthenticationToken: x => 2 * x,
        setComponent: jest.fn(),
        getComponent: jest.fn(),
    };

    globalAny.window.manywho.component = {
        handleEvent: jest.fn(),
        getByName: manywho.component.getByName,
        register: manywho.component.register,
    };

    globalAny.window.manywho.model = {
        getComponent: () => '3',
        getOutcomes: manywho.model.getOutcomes,
    };

    function manyWhoMount() {

        globalAny.window.Dropzone = () => 'Dropzone';

        return shallow(<FileUpload id="1" flowKey="2" multiple={false} uploadCaption="" />);
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
            .toHaveBeenCalledWith('file-upload', FileUpload, ['file_upload']); 
    });

    test('Component sends the correct information from the File Uploader to uploadFiles', () => {
        FileUpload.defaultProps.upload(2, 2, 5, 1, 2);
        expect(globalAny.window.manywho.ajax.uploadFiles).toHaveBeenCalledWith(1, 2, 3, 4, 5, 6);
    });

    test('Component uploadComplete function marks items as selected and calls setComponent and handleEvent', () => {
        componentWrapper = manyWhoMount();
        uploadComplete(
            {
                objectData: [
                    {
                        isSelected: false,
                        data: 1,
                    },
                    {
                        isSelected: false,
                        data: 2,
                    },
                ],
            },
            '1',
            '2',
        );
        expect(globalAny.window.manywho.state.setComponent).toHaveBeenCalledWith(
            '1',
            { objectData:
                [
                    {
                        isSelected: true,
                        data: 1,
                    },
                    {
                        isSelected: true,
                        data: 2,
                    },
                ],
            },
            '2',
            true,
        );
        expect(globalAny.window.manywho.component.handleEvent).toHaveBeenCalledWith(
            null,
            '3',
            '2',
        );
    });

});
