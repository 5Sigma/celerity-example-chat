import React from 'react';
import {
  Grid,
  Message,
  Button,
  Header,
  Form,
  Segment,
  Divider
} from '5sigma-ui';

import {apiQuery} from '../utils/Query';

import Session from '../Context/Session';

/**
 * LoginContainer
 * Class Description
 *
 * Usage:
 *     <LoginContainer />
 */

class LoginContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      data: {
        name: '',
        password: ''
      },
      errors: []
    };
    this.formChange = this.formChange.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  formChange(e, v) {
    const { data } = this.state;

    this.setState({
      errors: [],
      data: { 
        ...data,
        [v.name]: v.value 
      },
    });
  }

  login() {
    const errors = [];
    if (this.state.data.name.trim() === '') {
      errors.push('A name is required' );
    }
    if (this.state.data.password.trim() === '') {
      errors.push('A password is required' );
    }
    if (errors.length > 0) {
      this.setState({errors});
      return;
    }
    apiQuery('POST', '/login', this.state.data).then((r) => {
        this.props.updateSession(r.data.data)
        this.props.history.push('/room/lobby');
    }).catch((r) => {
      this.setState({
        errors:['Could not log you in. Check your credentials and try again']
      });
    });
  }

  signup() {
    const errors = [];
    if (this.state.data.name.trim() === '') {
      errors.push('A name is required' );
    }
    if (this.state.data.password.trim() === '') {
      errors.push('A password is required' );
    }
    if (this.state.data.name.trim().length < 3){
      errors.push('Your name must be greater than 3 characters.' );
    }
    if (this.state.data.password.trim().length < 6){
      errors.push('Your password must be greater than 6 characters.' );
    }
    if (errors.length > 0) {
      this.setState({errors});
      return;
    }
    apiQuery('POST', '/signup', this.state.data).then((r) => {
      if (r.status === 200) {
        this.props.updateSession(r.data.data)
        this.props.history.push('/room/lobby');
      } else {
        this.setState({errors: ['Could not signup']})
      }
    })
  }

  render() {
    return (
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={6}>
            <Divider section hidden />
            <Divider section hidden />
            <Divider section hidden />
            <Message error 
              hidden={ this.state.errors.length  === 0 } 
              list={ this.state.errors } 
            />
            <Header inverted attached="top">Login</Header>
            <Segment attached="bottom">
              <Form>
                <Form.Input 
                  name="name"
                  onChange={this.formChange}
                  value={this.state.data.name}
                  label="Name"
                />
                <Form.Input 
                  name="password"
                  label="Password"
                  type="password"
                  onChange={this.formChange}
                  value={this.state.data.password}
                />
                <Button.Group fluid>
                  <Button primary onClick={this.login}>Login</Button>
                  <Button.Or/>
                  <Button onClick={this.signup}>Signup</Button>
                </Button.Group>
              </Form> 
            </Segment> 
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Session(LoginContainer);

