import React from 'react';
import {
    List
} from '5sigma-ui';

/**
 * UserList
 * Class Description
 *
 * Usage:
 *     <UserList />
 */

export default class UserList extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

  render() {
    if (!this.props.users) {
      return null
    }
        return (
          <List className="messages-scroll" selection relaxed>
            {
              this.props.users.map(u => 
                <List.Item key={ u.id }>
                    <List.Icon name='user' color="blue" size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header>{ u.name }</List.Header>
                    </List.Content>
                </List.Item>
              )
            }
            </List>
        );
    }

}
