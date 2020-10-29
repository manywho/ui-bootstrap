import * as React from 'react';
import * as $ from 'jquery';
import 'jquery-textcomplete';
import registeredComponents from '../constants/registeredComponents';
import IFeedInputProps from '../interfaces/IFeedInputProps';
import fileUpload from './file-upload';

interface IFeedInputState {
    attachedFiles: any[];
    mentionedUsers: any;
}

class FeedInput extends React.Component<IFeedInputProps, IFeedInputState> {
    constructor(props) {
        super(props);

        this.state = {
            attachedFiles: [],
            mentionedUsers: {},
        };

        this.textareaRef = React.createRef();
        this.fileUploadRef = React.createRef();
    }

    componentDidMount() {

        const textarea = this.textareaRef.current;
        const { flowKey } = this.props;

        ((instance) => {
            $(textarea).textcomplete(
                [{
                    match: /@([A-Za-z]{2,})$/,
                    index: 1,
                    search(term, callback) {

                        manywho.social.getUsers(flowKey, term)
                            .done(response => callback(response || []))
                            .fail(() => callback([]));

                    },
                    template(value) {

                        return `<img src="${value.avatarUrl}" alt="avatar"> ${value.fullName}`;

                    },
                    replace(value) {

                        const { mentionedUsers } = instance.state;
                        mentionedUsers[value.id] = value;

                        instance.setState({ mentionedUsers });

                        return `@[${value.fullName}] `;
                    },
                }],
                { appendTo: $('.mw-bs') },
            );
        })(this);
    }

    send = () => {

        let deferred = null;
        const fileUploadElement: any = this.fileUploadRef.current;
        const textAreaElement: any = this.textareaRef.current;

        if (this.fileUploadRef && fileUploadElement && fileUploadElement.state.fileNames.length > 0) {
            deferred = fileUploadElement.onUpload();
        } else {
            deferred = $.Deferred();
            deferred.resolve();
        }

        deferred.done(() => this.props.send(
            textAreaElement.value,
            this.props.messageId,
            this.state.mentionedUsers,
            this.state.attachedFiles,
        )).then(() => {
            textAreaElement.value = '';
            this.setState({
                mentionedUsers: {},
                attachedFiles: [], // empty attached files also so we don't try to send them again in the next message
            });
        });
    }

    onKeyPress = (e) => {

        e.stopPropagation();

        if (e.charCode === 13 && !e.shiftKey) {

            e.preventDefault();
            this.send();
        }
    }

    private textareaRef: React.RefObject<any>;

    private fileUploadRef: React.RefObject<any>;

    render() {

        const FileUpload: typeof fileUpload = manywho.component.getByName(registeredComponents.FILE_UPLOAD);

        let fileUploadComponent = null;

        if (this.props.isAttachmentsEnabled) {

            const fileUploadProps = {
                flowKey: this.props.flowKey,
                multiple: true,
                upload: (flowKey: string, _: FormData, onProgress: EventListenerOrEventListenerObject, files: File[]) => {
                    // Construct some form data, for backwards compatibility
                    const formData = new FormData();
                    if (files) {
                        files.forEach((file, i) => {
                            formData.append(`FileData${i}`, file);
                        });
                    }

                    manywho.social.attachFiles(flowKey, formData, onProgress)
                        .done(response => this.setState({ attachedFiles: response.files }))
                        .fail((xhr) => {
                            manywho.model.addNotification(flowKey, {
                                message: `File upload failed! Error code: ${xhr.status} - ${xhr.statusText}`,
                                position: 'center',
                                type: 'danger',
                                timeout: '0',
                                dismissible: true,
                            });
                        });
                },
                smallInputs: true,
                isChildComponent: true,
                isUploadVisible: true,
                id: this.props.id,
                browseCaption: 'Attach Files',
                ref: this.fileUploadRef,
            };

            fileUploadComponent = <FileUpload {...fileUploadProps} />;
        }

        return (
            <div className="feed-post clearfix">
                <div className="feed-post-text">
                    <textarea
                        className="form-control feed-message-text"
                        rows={2}
                        onKeyPress={this.onKeyPress}
                        defaultValue=""
                        ref={this.textareaRef}
                    />

                    { fileUploadComponent }
                </div>
                <button
                    className="btn btn-sm btn-primary feed-post-send"
                    onClick={this.send}
                >
                    {this.props.caption}
                </button>
            </div>
        );
    }
}

manywho.component.register(registeredComponents.FEED_INPUT, FeedInput);

export const getFeedInput = (): typeof FeedInput => manywho.component.getByName(registeredComponents.FEED_INPUT) || FeedInput;

export default FeedInput;
