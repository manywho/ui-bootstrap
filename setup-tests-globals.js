
/**
 * A setup files used by jest for adding
 * mock objects to the global namespace that
 * the Tooling expects to be there.
 */
 
// The global ManyWho object
window.manywho = {
    adminTenantId: 'test',
    cdnUrl: '.',
    settings: {
        isDebugEnabled: ((a) => {
            return true;
        })
    },
    log: {
        info: ((a) => {
            return a;
        })
    },
    styling: {
        getClasses: ((a,b,c,d) => {
            return [];
        })
    },
    model: {
        getComponent: ((a,b) => {
            return {};
        }),
        getOutcomes: ((a,b) => {
            return [];
        })
    },
    utils: {
        isNullOrWhitespace: ((a) => {
            return true;
        })
    },
    component: {
        getByName: ((dummyComponent) => {
            return dummyComponent;
        }),
        register: ((name, component) => {
            return component;
        })
    }
};

