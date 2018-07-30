import React from 'react';
import PropTypes from 'prop-types'
import {
    Input,
    Button
} from 'semantic-ui-react';

/**
 * ChatInput
 * Class Description
 *
 * Usage:
 *     <ChatInput />
 */

export default class ChatInput extends React.Component {

    constructor() {
        super();
        this.state = { value: '' };

        this.inputChange = this.inputChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    inputChange(e, v) {
        this.setState({value: v.value})
    }

    sendMessage() {
        this.props.onMessage(this.state.value);
        this.setState({value: ''})
    }

    render() {
        return (
            <Input fluid
                action={
                    <Button basic onClick={this.sendMessage}>Send</Button>
                }
                onChange={this.inputChange}
                value={this.state.value}
                placeholder="enter a message"/>
        );
    }

}

ChatInput.propTypes = {
    onMessage: PropTypes.func.isRequired
};



