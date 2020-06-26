
/**
 * A setup files used by jest for adding
 * mock objects to the global namespace that
 * the Tooling expects to be there.
 */

const t = () => true;
const f = () => false;
const obj = () => ({});
const arr = () => [];
const noop = () => {};
const str = () => 'xxx';
 
// The global ManyWho object
window.manywho = {
    adminTenantId: 'test',
    cdnUrl: '',
    component: {
        handleEvent: jest.fn(),
        getChildComponents: jest.fn(),
        getByName: jest.fn(),
        getOutcomes: jest.fn(),
        getSelectedRows: jest.fn(),
        onOutcome: jest.fn(),
        register: jest.fn(),
        registerItems: jest.fn(),
        registerContainer: jest.fn(),
        getDisplayColumns: jest.fn(arr),
        focusInput: jest.fn(),
        mixins: {
            enterKeyHandler: {
                onEnter: jest.fn(),
            },
        },
    },
    log: {
        info: jest.fn(),
        error: jest.fn(),
    },
    styling: {
        registerContainer: jest.fn(),
        getClasses: jest.fn(arr),
    },
    model: {
        getChildren: jest.fn(arr),
        getComponent: jest.fn(obj),
        getContainer: jest.fn(() => ({
            containerType: 'xxx',
        })),
        getAttributes: jest.fn(obj),
        getDefaultNavigationId: jest.fn(str),
        getInvokeType: jest.fn(str),
        getOutcomes: jest.fn(),
        getModal: jest.fn(),
        getLabel: jest.fn(),
        getNavigation: jest.fn(),
        getOutcome: jest.fn(() => ({
            attributes: {},
            pageActionType: 'xxx',
        })),
        getNotifications: jest.fn(arr),
        getHistory: jest.fn(arr),
        getHistoricalNavigation: jest.fn(obj),
        getMapElement: jest.fn(obj),
    },
    state: {
        getComponent: jest.fn(),
        setComponent: jest.fn(obj),
        getComponents: jest.fn(obj),
    },
    utils: {
        convertToArray: jest.fn(arr),
        isNullOrWhitespace: jest.fn(),
        isNullOrUndefined: jest.fn(t),
        isNullOrEmpty: jest.fn(t),
        isEqual: jest.fn(),
        extractElement: jest.fn(),
        removeLoadingIndicator: jest.fn(),
        guid: jest.fn(str),
        extend: jest.fn(),
    },
    tours: {
        getTargetElement: jest.fn(() => ({
            getBoundingClientRect: jest.fn(),
        })),
    },
    settings: {
        global: jest.fn(arr),
        isDebugEnabled: jest.fn(f),
        flow: jest.fn(),
    },
    social: {
        getStream: jest.fn(),
    },
    formatting: {
        toMomentFormat: jest.fn(str),
        format: jest.fn(),
    },
    engine: {
        objectDataRequest: jest.fn(),
        fileDataRequest: jest.fn(),
        navigate: jest.fn(),
    },
};
