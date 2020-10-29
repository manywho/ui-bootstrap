import * as React from 'react';
import { mount } from 'enzyme';

import Presentation from '../js/components/presentation';

describe('Presentation component behaviour', () => {

    let componentWrapper;

    const globalAny:any = global;

    function manyWhoMount(props) {

        return mount(<Presentation {...props} />);
    }

    afterEach(() => {
        componentWrapper.unmount();
    });

    test('Component renders without crashing', () => {
        componentWrapper = manyWhoMount({});
        expect(componentWrapper.length).toEqual(1);
    });

    test('Component gets registered', () => {
        componentWrapper = manyWhoMount({});
        expect(globalAny.window.manywho.component.register)
            .toHaveBeenCalledWith('presentation', Presentation);
    });

    test('Simple render', () => {

        globalAny.window.manywho.utils.isNullOrUndefined = () => false;
        globalAny.window.manywho.model.getComponent = () => ({ visible: true, content: 'test content' });
        globalAny.window.manywho.settings.global = () => false;

        componentWrapper = manyWhoMount({ id: 'test' });
        expect(componentWrapper.instance().forTestingOnly()).toEqual('test content');
    });

    test('DOMPurify removes dangerous scripting', () => {

        globalAny.window.manywho.utils.isNullOrUndefined = () => false;
        globalAny.window.manywho.model.getComponent = () => ({ visible: true, content: '<img src="x" onerror="alert(1)">' });
        globalAny.window.manywho.settings.global = () => true; // Fake Player setting, disableScripting == true
        console.error = jest.fn();

        componentWrapper = manyWhoMount({ id: 'test', flowKey: 'a' });
        expect(componentWrapper.instance().forTestingOnly()).toEqual('<img src="x">');
        expect(console.error).toHaveBeenCalled();
    });

    test('DOMPurify leaves dangerous scripting with option disabled', () => {

        globalAny.window.manywho.utils.isNullOrUndefined = () => false;
        globalAny.window.manywho.model.getComponent = () => ({ visible: true, content: '<img src="x" onerror="alert(1)">' });
        globalAny.window.manywho.settings.global = () => false; // Fake Player setting, disableScripting == false

        componentWrapper = manyWhoMount({ id: 'test', flowKey: 'a' });
        expect(componentWrapper.instance().forTestingOnly()).toEqual('<img src="x" onerror="alert(1)">');
    });

});
