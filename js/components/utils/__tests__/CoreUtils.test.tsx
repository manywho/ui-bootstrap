import * as React from 'react';
import { renderOutcomesInOrder } from '../CoreUtils';

describe('Core utilities expected functionality', () => {

    test('No inline outcome displays just the component', () => {
        const element = <div />;
        const outcome = <span />;
        const outComeMeta = { isBulkAction: false };

        const result1 = renderOutcomesInOrder(element, [], [], true);
        expect(result1).toEqual(element);

        // There has to be both an array of outcome components
        // and an arry of outcome meta data passed in else
        // the UI component has to be returned
        const result2 = renderOutcomesInOrder(element, [outcome], [], true);
        expect(result2).toEqual(element);

        const result3 = renderOutcomesInOrder(element, [], [outComeMeta], true);
        expect(result3).toEqual(element);
    });

    test('An inline outcome marked as to appear at the top of the component', () => {
        const element = <div />;
        const outcome = <span />;
        const result = renderOutcomesInOrder(element, [outcome], [{ isBulkAction: true }], true);
        expect(result).toEqual([outcome, element]);
    });

    test('An inline outcome not marked as to appear at the top of the component', () => {
        const element = <div />;
        const outcome = <span />;
        const result = renderOutcomesInOrder(element, [outcome], [{ isBulkAction: false }], true);
        expect(result).toEqual([element, outcome]);
    });

    test('Multiple inline outcomes with different positioning', () => {
        const element = <div />;
        const outcome1 = <span id="outcome1" />;
        const outcome2 = <span id="outcome2" />;
        const result = renderOutcomesInOrder(element, [outcome1, outcome2], [{ isBulkAction: true }, { isBulkAction: false }], true);
        expect(result).toEqual([outcome1, element, outcome2]);
    });

    test('If the component is not visible then the outcomes don\'t render', () => {
        const element = <div />;
        const outcome = <span />;
        const outComeMeta = { isBulkAction: false };

        const result1 = renderOutcomesInOrder(element, [outcome], [outComeMeta], false);
        expect(result1).toEqual(element);
    });
});
