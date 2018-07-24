import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as $ from 'jquery';
import 'jquery-textcomplete';
import registeredComponents from '../constants/registeredComponents';
import IFeedInputProps from '../interfaces/IFeedInputProps';

interface IFeedInputState {
    mentionedUsers: any;
}

class FeedInput extends React.Component<IFeedInputProps, IFeedInputState> {

    constructor(props) {
        super(props);

        this.state = {
            mentionedUsers: {},
        };
    }

    send = () => {

        let deferred = null;
        const fileUploadElement = (this.refs.files as any);
        const textAreaElement = (this.refs.textarea as any);

        if (this.refs.files && fileUploadElement.state.fileNames.length > 0) {

            deferred = fileUploadElement.onUpload();

        } else {

            deferred = $.Deferred();
            deferred.resolve();
        }

        deferred.done((response) => {

            return this.props.send(
                textAreaElement.value,
                this.props.messageId,
                this.state.mentionedUsers,
                response && response.files,
            );

        })
            .then(() => {
                textAreaElement.value = '';
                this.setState({
                    mentionedUsers: {},
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

    componentDidMount() {

        const textarea = (this.refs.textarea as any);
        const flowKey = this.props.flowKey;

        ((instance) => {
            $(findDOMNode(textarea)).textcomplete(
                [{
                    match: /@([A-Za-z]{2,})$/,
                    index: 1,
                    search(term, callback) {

                        manywho.social.getUsers(flowKey, term)
                            .done(response => callback(response || []))
                            .fail(response => callback([]));

                    },
                    template(value) {

                        return '<img src="' + value.avatarUrl + '"></img> ' + value.fullName;

                    },
                    replace(value) {

                        const mentionedUsers = instance.state.mentionedUsers;
                        mentionedUsers[value.id] = value;

                        instance.setState({ mentionedUsers });

                        return '@[' + value.fullName + '] ';
                    },
                }],
                { appendTo: $('.mw-bs') },
            );
        })(this);
    }

    render() {

        const FileUpload: typeof fileUpload = manywho.component.getByName(registeredComponents.FILE_UPLOAD);

        let fileUpload = null;

        if (this.props.isAttachmentsEnabled) {

            const fileUploadProps = {
                flowKey: this.props.flowKey,
                multiple: true,
                upload: manywho.social.attachFiles,
                smallInputs: true,
                isChildComponent: true,
                isUploadVisible: false,
                id: this.props.id,
                browseCaption: 'Attach Files',
                ref: 'files',
            };

            fileUpload = <FileUpload {...fileUploadProps} />;
        }

        return <div className={'feed-post clearfix'}>
            <div className={'feed-post-text'}>
                <textarea
                    className={'form-control feed-message-text'}
                    rows={2}
                    onKeyPress={this.onKeyPress}
                    defaultValue={''}
                    ref={'textarea'} />
                {fileUpload}
            </div>
            <button
                className={'btn btn-sm btn-primary feed-post-send'}
                onClick={this.send}>
                {this.props.caption}
            </button>
        </div>;
    }
}

manywho.component.register(registeredComponents.FEED_INPUT, FeedInput);

export const getFeedInput = (): typeof FeedInput => manywho.component.getByName(registeredComponents.FEED_INPUT) || FeedInput;

export default FeedInput;
