import React from 'react';
import {
  Grid,
  Modal,
  Icon,
  Button,
  Segment,
  Form,
  Divider,
  Header
} from '5sigma-ui';

import RoomMessages from './RoomMessages';
import UserList from './UserList';
import ChatInput from './ChatInput';
import Messages from '../Context/Messages';
import { authQuery } from '../utils/Query';
import CreateRoom from './CreateRoom';


/**
 * Container
 * Class Description
 *
 * Usage:
 *     <Container />
 */

class Container extends React.Component {

  constructor() {
    super();
    this.state = {  
      loading: true,
      room: {},
      nonexistant: false
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.roomCreated = this.roomCreated.bind(this);
  }

  sendMessage(msg) {
    this.props.send('room-message', {
      slug: this.props.match.params.slug,
      message: msg
    })
  }

  componentDidMount() {
    this.joinRoom()
  }

  joinRoom(newSlug) {
    const slug = newSlug || this.props.match.params.slug;

    authQuery('GET', `/rooms/${slug}`).then((r) => {
      this.setState({room: r.data.data, loading: false})
    }).catch((r) => {
      if (r.response.status === 404) {
        this.setState({loading: false, nonexistant: true})
      }
    });
    this.props.joinRoom(slug);
  }

  componentWillUnmount() {
    this.props.leaveRoom(this.props.match.params.slug);
  }

  changeRoom(newRoom) {
    this.setState({openChangeRooms: false});
    this.props.history.push(`/room/${this.state.roomIdentifier}`);
    this.props.leaveRoom(this.props.match.params.slug);
    this.joinRoom(this.state.roomIdentifier);
  }

  roomCreated() {
    this.joinRoom(this.props.match.params.slug);
    this.setState({ nonexistant: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Divider hidden section />
          <Divider hidden section />
          <Segment basic loading></Segment>
        </div>
      )
    }
    if (this.state.nonexistant) {
      return (
        <CreateRoom onCreate={ this.roomCreated }/>
      ) 
    }
    const { slug } = this.props.match.params;

    const messages = this.props.messages[slug];
    return (
      <Segment>
        <Header>
          <Button animated floated="right" 
            onClick={() => this.setState({ openChangeRooms: true })}>
            <Button.Content visible>Change Rooms</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
          <Header.Content>
            { this.state.room.name }
          </Header.Content>
          <Header.Subheader>
            { this.state.room.topic }
          </Header.Subheader>
        </Header>
        <Grid celled>
          <Grid.Row>
            <Grid.Column width={12}>
              <RoomMessages messages={ messages }/>
            </Grid.Column>
            <Grid.Column width={4}>
              <UserList users={ this.props.users[slug] }/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <ChatInput onMessage={this.sendMessage} /> 
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal size="mini" 
          dimmer="blurring" 
          onClose={ () => this.setState({openChangeRooms: false})}
          open={this.state.openChangeRooms}>
          <Modal.Header>
            Change Rooms 
          </Modal.Header> 
          <Modal.Description>
            <Segment basic>
              <Form>
                <Form.Input onChange={ (e,v) => this.setState({roomIdentifier: v.value}) } fluid label="Room identifier"/>
              </Form>
            </Segment>
          </Modal.Description>
          <Modal.Actions>
            <Button onClick={ () => this.setState({openChangeRooms: false})}>
              Cancel 
            </Button>
            <Button positive
              onClick={ this.changeRoom}
            >
              Go to room 
            </Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

export default Messages(Container);
