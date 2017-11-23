
/**
 * A setup files used by jest for adding
 * mock objects to the global namespace that
 * the Tooling expects to be there.
 */
 
// The global ManyWho object
window.manywho = {
    adminTenantId: 'test',
    cdnUrl: '',
    component: {
        getByName: jest.fn(),
        register: jest.fn(),
    },
};

