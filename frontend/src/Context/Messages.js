import React, { Component } from 'react';
import PropTypes from 'prop-types';


const Context = React.createContext({
  questions: [],
  send: () => ({}),
});
var SOCKET;

class Provider extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token')
    SOCKET = new WebSocket(`ws://localhost:5050/ws/${token}`);
    SOCKET.onmessage = this.messageReceived.bind(this);
    SOCKET.onopen = this.onOpenSocket.bind(this);

    SOCKET.onclose = () => {
      console.log('socket close');
    };
    this.state = {
      messages: {},
      users: {},
      send: this.send.bind(this),
      joinRoom: this.joinRoom.bind(this),
      leaveRoom: this.leaveRoom.bind(this)
    };
    this.preconnectMessages = [];
  }

  onOpenSocket() {
    console.log('socket opened');
    this.socketOpen = true;
    this.preconnectMessages.forEach((i) => SOCKET.send(JSON.stringify(i)))
  }

  joinRoom(slug) {
    this.send('join-room', {
      slug: slug
    });
    const { messages } = this.state.messages;
    
    this.setState({
      messages: {
        ...messages,
        [slug]: []
      },
      users: {
        [slug]: []
      }
    })
  }

  leaveRoom(slug) {
    this.send('part-room', {
      slug: slug
    });
    const { messages } = this.state;
    messages[slug] = []
    
    this.setState({
      messages
    });
  }

  send(action, value = {}) {
    const payload = {
      action,
      ...value,
    };
    console.info('sending to socket: ', payload);
    if (!this.socketOpen) {
      this.preconnectMessages.push(payload)
    } else {
      SOCKET.send(JSON.stringify(payload));
    }
  }

  socketInit() {
    const username = localStorage.getItem('username');
    if (username) {
      if (this.socketOpen) {
        this.send('init', username);
      }
    }
  }


  messageReceived(e) {
    let data = {};
    try {
      data = JSON.parse(e.data);
    } catch (ex) {
      console.error(`could not parse socket message: ${e.data}`);
      return;
    }

    console.info('incomming message: ', data);

    switch (data.event) {
      case  'room-message':
        const { messages } = this.state;
        messages[data.data.destination.slug].push(data.data);
        this.setState({
          messages
        })
        break;
      case 'room-users':
        const { users } = this.state;
        this.setState({ 
          users:  {
            ...users,
            [data.data.slug]: data.data.users
          }
        })
        break;
      default:
        return
    }
  }

  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.state}>
        { children }
      </Context.Provider>
    );
  }
}

const connect = (Cmp) => {
  const sub = props => (
    <Context.Consumer>
      {
        context => (
          <Cmp {...props} {...context}>
            { props.children }
          </Cmp>
        )
      }
    </Context.Consumer>
  );
  sub.propTypes = {
    children: PropTypes.element,
  };
  sub.defaultProps = {
    children: null,
  };
  return sub;
};

connect.Consumer = Context.Consumer;
connect.Provider = Provider;

export default connect;
