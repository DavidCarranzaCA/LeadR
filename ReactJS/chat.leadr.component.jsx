import React from 'react'
import ConversationsList from '@app/components/conversations/conversations.navbar.jsx'
import ChatBox from '@app/components/chatbox/chat-box.component.jsx'
import tostada from '@app/helpers/Tostada';
import UserChat from '@app/components/conversations-chat-list/user-chat.component.jsx';

class ConversationsChatList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            ws: null,
            isChatInitialized: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.retrieveChatHistory = this.retrieveChatHistory.bind(this);
    }

    componentDidMount() {
        this.setState({
            ws: null,
            isChatInitialized: false
        })
    }

    componentWillUnmount() {
        this.setState({
            messages: [],
        })
        window.removeEventListener('click', this.handleClick, false);
    }

    handleClick(convoId, userId, event) {
        event.persist()

        if (!this.state.isChatInitialized) {
            this.initializeChatConnection(event)
        }

        if (this.state.isChatInitialized) {
            let newChat = {
                "type": 'getUserChatHistory',
                "data": {
                    "text": convoId,
                    "senderId": userId
                }
            };
            this.state.ws.send(JSON.stringify(newChat));
        }
    }

    retrieveChatHistory(messageHistory) {
        Array.isArray(messageHistory) ? this.setState({ messages: messageHistory.filter(message => message) }) : console.log('| WebSocket | ERROR message history must be an array');
    };

    initializeChatConnection(event) {
        this.setState(
            {
                ws: new WebSocket('ws://localhost:1337'),
                isChatInitialized: true
            },
            () => {
                this.state.ws.addEventListener('message', (msg) => {
                    let messageObject = {}
                    try {
                        messageObject = JSON.parse(msg.data) || null;
                    } catch (e) {
                        alert(e)
                    }
                    if (messageObject.type) {
                        switch (messageObject.type) {
                            case 'getUserChatHistory':
                                messageObject.data ? this.retrieveChatHistory(messageObject.data) : this.retrieveChatHistory('');
                                break;
                            case 'set-cookie':
                                document.cookie = 'ls=' + messageObject.data.text;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        );
    };


    render() {

        return (
            <div>
                <br />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default" style={{ backgroundColor: "#FFF9", boxShadow: '5px 10px 5px 0px rgba(0,0,0,0.2)' }}>
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="col-md-2" style={{ borderRight: '1px dotted #999', padding: '0 20px 0 20px' }}>
                                            <ConversationsList onSelect={this.handleClick} />
                                        </div>

                                        <div className="col-md-8 col-md-offset-1" style={{ maxHeight: '100%', overFlowY: 'auto' }}>
                                            <br />
                                            <br />
                                            <ChatBox userMessage={this.state.messages} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConversationsChatList