import { checkBooleanString } from '../DataUtils';
import { str } from '../../../../test-utils';

describe('Data utilities expected functionality', () => {
    
    test('Returns true if passed any capitalization of the word true', () => {
        let result = checkBooleanString("True");
        expect(result).toBe(true);
        result = checkBooleanString("true");
        expect(result).toBe(true);
        result = checkBooleanString("TRUE");
        expect(result).toBe(true);
        result = checkBooleanString("tRuE");
        expect(result).toBe(true);
    });

    test('Returns false if passed any capitalization of the word false', () => {
        let result = checkBooleanString("False");
        expect(result).toBe(false);
        result = checkBooleanString("false");
        expect(result).toBe(false);
        result = checkBooleanString("FALSE");
        expect(result).toBe(false);
        result = checkBooleanString("fAlSe");
        expect(result).toBe(false);
    });

    test('Returns false if passed any other word', () => {
        let result = checkBooleanString(null);
        expect(result).toBe(false);
        result = checkBooleanString(undefined);
        expect(result).toBe(false);
        result = checkBooleanString("");
        expect(result).toBe(false);
        result = checkBooleanString("test");
        expect(result).toBe(false);
        result = checkBooleanString(str(6));
        expect(result).toBe(false);
    });

    test('Returns boolean value when provided one', () => {
        let result = checkBooleanString(true);
        expect(result).toBe(true);
        result = checkBooleanString(false);
        expect(result).toBe(false);
    });
});
