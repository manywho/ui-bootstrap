/**
 * Some useful utility functions to be
 * used when writing Jest tests.
 */

export default {

    generateRandomString:(length) => {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    generateRandomInteger:(min, max) => {
        return Math.ceil(Math.random() * (max - min) + min);
    }
    
}