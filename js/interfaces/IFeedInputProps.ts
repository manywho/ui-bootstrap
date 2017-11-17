import IComponentProps from './IComponentProps';

interface IFeedInputProps extends IComponentProps {
    send: Function;
    messageId: string;
    isAttachmentsEnabled: boolean;
    caption: string;
}

export default IFeedInputProps;
