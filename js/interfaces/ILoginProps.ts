import IComponentProps from './IComponentProps';

interface ILoginProps extends IComponentProps {
    callback: {
        execute: Function;
        context: any;
        args: any;
    };
    loginUrl: string;
    stateId: string;
    username: string;
    directoryName: string;
}

export default ILoginProps;
