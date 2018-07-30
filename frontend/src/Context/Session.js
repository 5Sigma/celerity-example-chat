import React, { Component } from 'react';
import PropTypes from 'prop-types';


const Context = React.createContext({ });

class Provider extends Component {
    constructor(props) {
      super(props);
        this.state = {
            session: {
                user: {},
            },
            updateSession: this.updateSession.bind(this),
            clearSession: this.clearSession.bind(this)
        };
    }

    render() {
        const { children } = this.props;
        return (
            <Context.Provider value={this.state}>
                { children }
            </Context.Provider>
        );
    }
    updateSession(session) {
        localStorage.setItem('token', session.token);
        this.setState({
            session: { 
                ...session,
                active: true
            }
        })
    }

    clearSession() {
        // localStorage.setItem('token', '');
        this.setState({
            session: {
                active: false
            } 
        })
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
