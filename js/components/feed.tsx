(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Feed: React.SFC<IItemsComponentProps> = ({ flowKey }) => {

        const onToggleFollow = (e) => {

            manywho.social.toggleFollow(flowKey);
        };

        const onRefresh = (e) => {

            manywho.social.refreshMessages(flowKey);
        };

        const onGetNextPage = (e) => {

            manywho.social.getMessages(flowKey);
        };

        const onSendMessage = (message, messageId, mentionedUsers, attachments) => {

            return manywho.social.sendMessage(
                flowKey, message, messageId, mentionedUsers, attachments
            );
        };

        const renderThread = (messages, isCommentingEnabled, isAttachmentsEnabled) => {

            if (messages) {

                return (
                    <ul className={'media-list'}>
                        {
                            messages.map(
                                (message) => {

                                    const createdDate = new Date(message.createdDate);
                                    const attachments = message.attachments || [];

                                    return <li className={'media'}>
                                        <div className={'media-left'}>
                                            <a href={'#'}>
                                                <img className={'media-object'} 
                                                    src={message.sender.avatarUrl} 
                                                    width={32} 
                                                    height={32} />
                                            </a>
                                        </div>
                                        <div className={'media-body feed-message'}>
                                            <div className={'media-heading'}>
                                                <span className={'feed-sender'}>
                                                { message.sender.fullName }
                                                </span>
                                                <span className={'feed-created-date'}>
                                                { createdDate.toLocaleString() }
                                                </span>
                                            </div>
                                            <div className={'feed-message-text'}
                                                dangerouslySetInnerHTML={ { __html: message.text } }
                                            />
                                            <div className={'feed-message-attachments'}>
                                            {
                                                attachments.map((attachment) => {
                                                    return <a 
                                                        href={attachment.downloadUrl}
                                                        target="_blank">
                                                        {attachment.name}
                                                    </a>;
                                                })
                                            }
                                            </div>
                                            {this.renderThread(message.comments, false, false)}
                                            {
                                                isCommentingEnabled && 
                                                React.createElement(
                                                    manywho.component.getByName('feed-input'), 
                                                    { 
                                                        flowKey, 
                                                        isAttachmentsEnabled, 
                                                        caption: 'Reply', 
                                                        messageId: message.id, 
                                                        send: this.onSendMessage, 
                                                    }, 
                                                    null,
                                                )
                                            }
                                        </div>
                                    </li>;

                                }, 
                                this,
                            )
                        }
                    </ul>
                );
            }

            return null;

        };

        const renderFollowers = (followers) => {

            if (followers) {

                const followerElements = followers.map((follower) => {

                    return <li>
                            <img className={'feed-follower'}
                                src={follower.avatarUrl}
                                title={follower.fullName}
                                width={32}
                                height={32} />
                        </li>;
                });

                return <div className={'row'}>
                <ul className={'list-inline'}>
                    <li><span><strong>Followers: </strong></span></li>
                    {followerElements}
                </ul>
            </div>;

            }

            return null;

        };

        const stream = manywho.social.getStream(flowKey);

        if (stream && stream.me) {

            manywho.log.info('Rendering Feed');

            const streamMessages = stream.messages || {};
            const state = manywho.state.getComponent('feed', flowKey) || {};

            const followCaption = (stream.me.isFollower) ? 'Un-Follow' : 'Follow';
            const isFooterVisible = streamMessages.nextPage && streamMessages.nextPage > 1;

            return <div className={'panel panel-default feed'} onKeyUp={this.onEnter}>
                <div className={ 'panel-heading clearfix' }>
                    <h3 className={'panel-title pull-left' }>Feed</h3>
                    <div className={'pull-right btn-group' }>
                        <button className={'btn btn-default btn-sm'}
                            onClick={this.onToggleFollow }>
                            <span className={'glyphicon glyphicon-pushpin'} />
                            followCaption
                        </button>
                        <button className={'btn btn-default btn-sm'}
                            onClick={this.onRefresh }>
                            <span className={'glyphicon glyphicon-refresh' } />
                            Refresh
                        </button>
                    </div>
                </div>
                <div className={ 'panel-body' }>
                    {this.renderFollowers(stream.followers)}
                    {
                        React.createElement(
                            manywho.component.getByName('feed-input'), 
                            { 
                                flowKey, 
                                caption: 'Post', 
                                send: this.onSendMessage, 
                                isAttachmentsEnabled: true,
                            }, 
                            null,
                        )
                    }
                    {this.renderThread(streamMessages.messages, true)}
                </div>
                <div className={ 'panel-heading clearfix ' + (!isFooterVisible) ? 'hidden' : '' }>
                    <button 
                        className={'btn btn-default pull-right'}
                        onClick={this.onGetNextPage }>
                        More
                    </button>
                </div>
                {
                    React.createElement(
                        manywho.component.getByName('wait'), 
                        { 
                            isVisible: state.loading != null, 
                            message: state.loading && state.loading.message, 
                            isSmall: true,
                        },
                        null,
                    )
                }
            </div>;
        }

        return null;
    };

    manywho.component.register('feed', Feed);

}(manywho));

