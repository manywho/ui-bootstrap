import * as React from 'react';
import { renderOutcomesInOrder } from '../CoreUtils';

describe('Core utilities expected functionality', () => {

    test('No inline outcome displays just the component', () => {
        const element = <div />;
        const outcome = <span />;
        const outComeMeta = { isBulkAction: false };

        const result1 = renderOutcomesInOrder(element, [], []);
        expect(result1).toEqual(element);

        // There has to be both an array of outcome components
        // and an arry of outcome meta data passed in else
        // the UI component has to be returned
        const result2 = renderOutcomesInOrder(element, [outcome], []);
        expect(result2).toEqual(element);

        const result3 = renderOutcomesInOrder(element, [], [outComeMeta]);
        expect(result3).toEqual(element);
    });

    test('An inline outcome marked as to appear at the top of the component', () => {
        const element = <div />;
        const outcome = <span />;
        const result = renderOutcomesInOrder(element, [outcome], [{ isBulkAction: true }]);
        expect(result).toEqual([outcome, element]);
    });

    test('An inline outcome not marked as to appear at the top of the component', () => {
        const element = <div />;
        const outcome = <span />;
        const result = renderOutcomesInOrder(element, [outcome], [{ isBulkAction: false }]);
        expect(result).toEqual([element, outcome]);
    });
});
