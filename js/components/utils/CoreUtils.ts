/**
 * @description Some utility functions that can be shared across UI components
 */

import { append, prepend } from 'ramda';
import IOutcomeMetaData from '../../interfaces/IOutcomeMetaData';

/* eslint-disable import/prefer-default-export */

interface IRenderOutcomesInOrder {
    (element: JSX.Element, outcomes : JSX.Element[], outcomeMeta : Array<IOutcomeMetaData>);
}

/**
 * @param element A JSX snippet describing the component to be rendered
 * @param outcomes An array of outcome components to be displayed inline
 * @param outcomeMeta An array of objects, each describing an outcome
 *
 * @description Determines whether to render a just the UI component or the component with an inline outcome
 *
 * @returns Either the JSX for the component being rendered, or if there is
 * an inline outcome to be displayed, an array of JSX snippets (one being the outcome, the other the component)
 * the order of which depends on the isBulkAction key value in the outcome metadata
 */
export const renderOutcomesInOrder: IRenderOutcomesInOrder = (element, outcomes, outcomeMeta) => {
    if ((!outcomes || outcomes.length === 0) || (!outcomeMeta || outcomeMeta.length === 0)) {
        return element;
    }

    const displayTop = outcomeMeta[0].isBulkAction;
    return displayTop ? prepend(outcomes[0], [element]) :
        append(outcomes[0], [element]);
};
