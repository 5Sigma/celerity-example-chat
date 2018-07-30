import React from 'react';
import Session from '../Context/Session';
import {
  Menu
} from '5sigma-ui';

/**
 * HeaderMenu
 * Class Description
 *
 * Usage:
 *   <HeaderMenu />
 */

class HeaderMenu extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Menu secondary>
        <Menu.Menu position="right">
          <Menu.Item>
              {this.props.session.user.name}
          </Menu.Item> 
        </Menu.Menu>
      </Menu>
    );
  }

}

export default Session(HeaderMenu);
