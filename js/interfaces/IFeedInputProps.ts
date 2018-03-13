import IComponentProps from './IComponentProps';

interface IFeedInputProps extends IComponentProps {
    send: Function;
    isAttachmentsEnabled: boolean;
    caption: string;
    messageId?: string;
}

export default IFeedInputProps;
