import * as React from 'react';
import { shallow } from 'enzyme';

import FileUpload from '../js/components/file-upload';

describe('FileUpload component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount() {

        globalAny.window.Dropzone = () => 'Dropzone';

        return shallow(<FileUpload upload={() => {}} multiple={false} uploadCaption={''} />);
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

});
