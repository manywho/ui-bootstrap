/**
 * @description Some utility functions that can be shared across UI components
 */

import { append, prepend } from 'ramda';

/* eslint-disable import/prefer-default-export */

interface IRenderOutcomesInOrder {
    (element: any, outcomes : any, outcomeMeta : any);
}

/**
 * @param element
 * @param outcomes
 * @param outcomeMeta
 * @description
 * @returns JSX
 */
export const renderOutcomesInOrder: IRenderOutcomesInOrder = (element, outcomes, outcomeMeta) => {
    if (!outcomes || outcomes.length === 0) {
        return element;
    }

    const displayTop = outcomeMeta[0].isBulkAction;
    return displayTop ? prepend(outcomes[0], [element]) :
        append(outcomes[0], [element]);
};
