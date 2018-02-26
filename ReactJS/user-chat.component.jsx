import React from 'react'
import { ButtonToolbar, Button, Overlay, Popover } from 'react-bootstrap';
import Form from 'react-jsonschema-form';

class UserChat extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <br />
                </div>
                <br />
                <div className="chat-window-conversation-box">
                    <br/>
                    {this.props.chatItems}
                </div>

                <div>
                    <br />
                    <Form
                        noHtml5Validate={true}
                        schema={this.props.formSchema}
                        formData={this.props.formData}
                        onSubmit={this.props.sendChatMsg}
                    >
                        <Button
                            bsSize="small"
                            className="chat-window-send-button pull-right"
                            type="submit"
                        >
                            Send
                        </Button>

                    </Form>
                </div>
            </React.Fragment >
        )
    }
}

export default UserChat