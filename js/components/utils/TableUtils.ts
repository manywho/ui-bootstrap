/**
 * @description Some utility functions that can be shared across UI components
 */

/* eslint-disable import/prefer-default-export */

import IObjectData from '../../interfaces/IObjectData';

interface ICheckRowIsSelected {
    (row: IObjectData, item : IObjectData);
}

/**
 * @param selectedRow an object representing a single table row marked as selected on the client
 * @param row an object representing a single table row from the backend
 * @description Determines whether a table row is in a selected state
 * @returns boolean
 */
export const checkRowIsSelected: ICheckRowIsSelected = (selectedRow, row) => {
    const rowSelectedOnClientSide = selectedRow.externalId || selectedRow.internalId;
    const rowSelectedOnServerSide = row.externalId || row.internalId;
    return rowSelectedOnServerSide === rowSelectedOnClientSide;
};
