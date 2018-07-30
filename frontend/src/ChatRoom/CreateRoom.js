import React from 'react';
import { authQuery } from '../utils/Query';
import { 
  Segment,
  Message,
  Form,
  Divider,
  Grid,
  Header,
  Button
} from '5sigma-ui';

import { withRouter } from 'react-router-dom';

/**
 * CreateRoom
 * Class Description
 *
 * Usage:
 *   <CreateRoom />
 */

class CreateRoom extends React.Component {

  constructor() {
    super();
    this.state = {
      data: {
        name: '',
        topic: ''
      }
    };
    this.createRoom = this.createRoom.bind(this);
    this.formChange = this.formChange.bind(this);
  }

  createRoom() {
    const {data  } =this.state ;
     
    const payload = {
      ...data,
      slug: this.props.match.params.slug
    };

    authQuery('POST', '/rooms',payload).then((r) => {
      this.props.onCreate()
    });
  }

  formChange(e, v) {
    const { data } = this.state;
    
    this.setState({
      data: {
        ...data,
        [v.name]: v.value
      }
    });
  }

  render() {
    return (
      <Segment basic>
        <Divider section hidden />
        <Divider section hidden />
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={8}>
              <Message info>
                <Message.Header>
                  Create a new room
                </Message.Header>
                <Message.Content>
                  This room does not exist.
                  You can create it as a new room below.
                </Message.Content>
              </Message>
              <Header attached="top">
                Create Room
              </Header>
              <Segment attached="bottom">
                <Form>
                  <Form.Input
                    name="name"
                    onChange={ this.formChange }
                    value={ this.state.data.name }
                    label="Room name"
                  />
                  <Form.Input
                    name="topic"
                    onChange={ this.formChange }
                    value={ this.state.data.topic }
                    label="Room topic"
                  />
                  <Button primary fluid
                    onClick={this.createRoom}
                  >
                    Create Room 
                  </Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

}

export default withRouter(CreateRoom)
