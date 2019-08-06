/**
 * @description Some utility functions that can be shared across UI components
 */

/* eslint-disable import/prefer-default-export */

export const checkBooleanString: any = (inputString) => typeof inputString === "boolean" ? inputString :
    typeof inputString === "string" ? inputString.toLowerCase() === 'true' :
    false