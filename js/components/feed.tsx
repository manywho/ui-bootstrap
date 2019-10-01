import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import feedInput from './feed-input';
import wait from './wait';
import '../../css/feed.less';

interface ErrorBoundary {
    hasError: boolean;
}

class Feed extends React.Component<IComponentProps, ErrorBoundary> {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // these two functions need to be arrow functions to preserve "this"
    onToggleFollow = (e) => {

        manywho.social.toggleFollow(this.props.flowKey);
    }

    // these two functions need to be arrow functions to preserve "this"
    onRefresh = (e) => {

        manywho.social.refreshMessages(this.props.flowKey);
    }

    onGetNextPage(e) {

        manywho.social.getMessages(this.props.flowKey);
    }

    onSendMessage = (message, messageId, mentionedUsers, attachments) => {

        return manywho.social.sendMessage(
            this.props.flowKey, message, messageId, mentionedUsers, attachments,
        );
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
    }

    renderThread(messages, isCommentingEnabled, isAttachmentsEnabled?) {

        const FeedInput: typeof feedInput = manywho.component.getByName(registeredComponents.FEED_INPUT);

        if (messages) {

            return (
                <ul className={'media-list'}>
                    {
                        messages.map(
                            (message) => {

                                const createdDate = new Date(message.createdDate);
                                const attachments = message.attachments || [];

                                return <li className={'media'} key={createdDate.toLocaleString()}>
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
                                                {message.sender.fullName}
                                            </span>
                                            <span className={'feed-created-date'}>
                                                {createdDate.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={'feed-message-text'}
                                            dangerouslySetInnerHTML={{ __html: message.text }}
                                        />
                                        <div className={'feed-message-attachments'}>
                                            {
                                                attachments.map((attachment, i) => {
                                                    return <a
                                                        key={i}
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
                                            <FeedInput
                                                flowKey={this.props.flowKey}
                                                caption={'Reply'}
                                                messageId={message.id}
                                                send={this.onSendMessage}
                                                isAttachmentsEnabled={isAttachmentsEnabled} />
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

    }

    renderFollowers(followers) {

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

    }

    render() {

        const FeedInput: typeof feedInput = manywho.component.getByName(registeredComponents.FEED_INPUT);
        const Wait: typeof wait = manywho.component.getByName(registeredComponents.WAIT);

        const stream = manywho.social.getStream(this.props.flowKey);

        if (this.state.hasError) {
            return <p className="text-danger">The feed cannot be displayed at this time.</p>;
        }

        if (stream && stream.me) {

            manywho.log.info('Rendering Feed');

            const streamMessages = stream.messages || {};
            const state = manywho.state.getComponent('feed', this.props.flowKey) || {};

            const followCaption = (stream.me.isFollower) ? 'Un-Follow' : ' Follow';
            const isFooterVisible = streamMessages.nextPage && streamMessages.nextPage > 1;

            return <div className={'panel panel-default feed'}>
                <div className={'panel-heading clearfix'}>
                    <h3 className={'panel-title pull-left'}>Feed</h3>
                    <div className={'pull-right btn-group'}>
                        <button className={'btn btn-default btn-sm'}
                            onClick={this.onToggleFollow}>
                            <span className={'glyphicon glyphicon-pushpin'} />
                            {' ' + followCaption}
                        </button>
                        <button className={'btn btn-default btn-sm'}
                            onClick={this.onRefresh}>
                            <span className={'glyphicon glyphicon-refresh'} />
                            {' Refresh'}
                        </button>
                    </div>
                </div>
                <div className={'panel-body'}>
                    {this.renderFollowers(stream.followers)}
                    <FeedInput
                        flowKey={this.props.flowKey}
                        caption={'Post'}
                        send={this.onSendMessage}
                        isAttachmentsEnabled={true} />
                    {this.renderThread(streamMessages.messages, true)}
                </div>
                <div className={'panel-heading clearfix ' + (!isFooterVisible) ? 'hidden' : ''}>
                    <button
                        className={'btn btn-default pull-right'}
                        onClick={this.onGetNextPage}>
                        More
                        </button>
                </div>
                <Wait isVisible={state.loading != null}
                    message={state.loading && state.loading.message}
                    isSmall={true} />
            </div>;
        }

        return null;
    }
}

manywho.component.register(registeredComponents.FEED, Feed);

export const getFeed = (): typeof Feed => manywho.component.getByName(registeredComponents.FEED) || Feed;

export default Feed;
