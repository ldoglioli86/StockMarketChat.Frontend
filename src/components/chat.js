import SendMessageForm from './sendmessageform';
import { Button } from "react-bootstrap"
import moment from 'moment';

const Chat = ({ messages, sendMessage, user, room, closeConnection }) => <div className="currentChat">
                <div className='user-in-room'>
                    <h3>You are in {room}</h3>
                    <div className='leave-room'>
                        <Button variant='danger' onClick={() => closeConnection()}>Leave Room</Button>
                    </div> 
                </div>
                <div className='chat'>
                    <div className='message-container'>
                    { messages.map((m, index) => 
                        <div key={index} className={"user-message " + (m.user === user ? 'my-message' : 'other-user-message')}   >
                            <div className={'message ' + (m.user === user ? 'bg-primary' : 'bg-info')}>{m.message}</div>
                            <div className="message-details">
                                <div>{m.user}</div>
                                <div>-</div> 
                                <div>{moment(new Date(m.datetime)).format('MM/DD/YYYY hh:mm:ss')}</div>
                            </div>
                        </div>
                    )}
                    </div>
                    <SendMessageForm sendMessage={sendMessage} user={user} room={room}/>
                </div>
            </div>
export default Chat;