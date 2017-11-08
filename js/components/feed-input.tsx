interface IFeedInputState {
    mentionedUsers: any;
}

(function (manywho) {
    
    class FeedInput extends React.Component<any, IFeedInputState> {

        constructor(props) {
            super(props);

            this.state = {
                mentionedUsers: {},
            };
        }
    
        send() {

            let deferred = null;
            const self = this;
            const fileUploadElement = (this.refs.files as HTMLElement);

            if (this.refs.files && this.refs.files.state.fileNames.length > 0) {

                deferred = this.refs.files.onUpload();

            } else {

                deferred = jQuery.Deferred();
                deferred.resolve();
            }

            deferred.done((response) => {

                return self.props.send(
                    self.refs.textarea.getDOMNode().value, 
                    self.props.messageId, 
                    self.state.mentionedUsers, 
                    response && response.files
                );

            })
            .then(() => {

                self.refs.textarea.getDOMNode().value = '';
            });
        }
    
    
        onKeyPress(e) {

            e.stopPropagation();

            if (e.charCode === 13 && !e.shiftKey) {

                e.preventDefault();
                this.send();
            }
        }

        componentDidMount() {

            const self = this;

            $(this.refs.textarea.getDOMNode()).textcomplete(
                [{
                    match: /@([A-Za-z]{2,})$/,
                    index: 1,
                    search(term, callback) {

                        manywho.social.getUsers(self.props.flowKey, term)
                            .done(response => callback(response || []))
                            .fail(response => callback([]));

                    },
                    template(value) {

                        return '<img src="' + value.avatarUrl + '"></img> ' + value.fullName;

                    },
                    replace(value) {

                        self.state.mentionedUsers[value.id] = value;
                        return '@[' + value.fullName + '] ';
                    },
                }],
                { appendTo: $('.mw-bs') },
            );
        }

        render() {

            let fileUpload = null;

            if (this.props.isAttachmentsEnabled) {

                fileUpload = React.createElement(
                    manywho.component.getByName('file-upload'), 
                    { 
                        flowKey: this.props.flowKey, 
                        multiple: true, 
                        upload: manywho.social.attachFiles, 
                        smallInputs: true, 
                        isChildComponent: true, 
                        isUploadVisible: false, 
                        id: this.props.id, 
                        browseCaption: 'Attach Files', 
                        ref: 'files',
                    },
                );    
            }

            return <div className={'feed-post clearfix'}>
                <div className={'feed-post-text'}>
                    <textarea 
                        className={'form-control feed-message-text'}
                        rows={2}
                        onKeyPress={this.onKeyPress}
                        onChange={this.onChange}
                        defaultValue={''}
                        ref={'textarea'} />
                    fileUpload
                </div>
                <button 
                    className={'btn btn-sm btn-primary feed-post-send'} 
                    onClick={this.send}>
                    {this.props.caption}
                </button>
            </div>;
        }
    }

    manywho.component.register('feed-input', FeedInput);
        
}(manywho));
