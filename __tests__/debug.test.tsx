import testUtils from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import DebugViewer from '../js/components/debug';

describe('Debug component behaviour', () => {

    let imageWrapper;
 
    beforeEach(() => {
        imageWrapper = shallow(<DebugViewer />);
    });

    test('Debug component renders without crashing', () => {
        expect(imageWrapper.length).toEqual(1);
    });
});
