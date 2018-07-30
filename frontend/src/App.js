import React, { Component } from 'react';
import {
  Switch, Route, BrowserRouter,
} from 'react-router-dom';

import ChatRoom from './ChatRoom';
import Login from './Login';
import './App.css';
import {
  Container,
} from 'semantic-ui-react';
import Messages from './Context/Messages';
import Session from './Context/Session';
import Secured from './Secured';
import HeaderMenu from './HeaderMenu';

class App extends Component {
  render() {
    return (
      <div>
        <Session.Provider>
          <BrowserRouter>
            <div>
              <Secured>
                <div>
                  <HeaderMenu />
                  <Container>
                    <Messages.Provider>
                      <Switch>
                        <Route path="/room/:slug" component={ChatRoom.Container} />
                        <Route path="/dm/:username" component={ChatRoom.Container} />
                      </Switch>
                    </Messages.Provider>
                  </Container>
                </div>
              </Secured>
              <Route path="/login" component={Login.Container} />
            </div>
          </BrowserRouter>
        </Session.Provider>
      </div>
    );
  }
}



export default App;
