import testUtils from '../test-utils';

import * as React from 'react';
import { shallow } from 'enzyme';

import Image from '../js/components/image';

describe('Image component behaviour', () => {

    let imageWrapper;
 
    beforeEach(() => {
        imageWrapper = shallow(<Image />);
    });

    test('Image component renders without crashing', () => {
        expect(imageWrapper.length).toEqual(1);
    });
});
