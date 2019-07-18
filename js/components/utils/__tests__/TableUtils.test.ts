import { checkRowIsSelected } from '../TableUtils';
import { str } from '../../../../test-utils';

describe('Table utilities expected functionality', () => {

    test('Returns true if external IDs match', () => {
        const externalId = str(10);
        const internalId = str(10);

        const selectedRow = {
            externalId,
            internalId,
        };

        const row = {
            externalId,
            internalId,
        };

        const result = checkRowIsSelected(selectedRow, row);
        expect(result).toBeTruthy();
    });

    test('Returns false if external IDs do not match', () => {
        const externalId1 = str(10);
        const externalId2 = str(10);
        const internalId1 = str(10);
        const internalId2 = str(10);

        const selectedRow = {
            externalId: externalId1,
            internalId: internalId1,
        };

        const row = {
            externalId: externalId2,
            internalId: internalId2,
        };

        const result = checkRowIsSelected(selectedRow, row);
        expect(result).toBeFalsy();
    });

    test('Returns true if internal IDs match', () => {
        const internalId = str(10);

        const selectedRow = {
            internalId,
        };

        const row = {
            internalId,
        };

        const result = checkRowIsSelected(selectedRow, row);
        expect(result).toBeTruthy();
    });

    test('Returns false if internal IDs no not match', () => {
        const internalId1 = str(10);
        const internalId2 = str(10);

        const selectedRow = {
            internalId: internalId1,
        };

        const row = {
            internalId: internalId2,
        };

        const result = checkRowIsSelected(selectedRow, row);
        expect(result).toBeFalsy();
    });
});
