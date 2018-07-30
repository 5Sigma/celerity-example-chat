import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Session from './Context/Session';
import { authQuery } from './utils/Query';


class Secured extends Component {
    constructor() {
        super()
        this.state = {
            validated: false
        };
    }
    componentDidMount() {
        authQuery('GET', '/validate')
        .then((r) => {
            if (r.status === 200) {
                this.props.updateSession(r.data.data)
                this.setState({validated: true})
            }
        })
        .catch((r) => {
            this.props.clearSession();
            this.props.history.push('/login');
        });
    }
    render() {
        if (!this.props.session.active) {
            return (
                <div>
                </div>
            );
        }
        return (
            <div>
                { this.props.children }            
            </div>
        )
    }
}

export default Session(withRouter(Secured));
