import React from 'react';
import {
  Feed
} from '5sigma-ui';

/**
 * RoomMessages
 * Class Description
 *
 * Usage:
 *     <RoomMessages />
 */

export default class RoomMessages extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    if (!this.props.messages) {
      return <div></div>
    }
    return (
      <Feed className="messages-scroll">
        { this.props.messages.map ( msg => 
          <Feed.Event key={ msg.id }>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>{ msg.sender.name }</Feed.User> { msg.message }
                <Feed.Date>1 Hour Ago</Feed.Date>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        )}
      </Feed>
    );
  }

}

