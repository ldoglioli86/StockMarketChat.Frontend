import { useState, useEffect } from "react";
import { Button } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { HubConnectionBuilder, LogLevel} from '@microsoft/signalr'
import Chat from './chat';
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    
    const [user, setUser] = useState();
    const [userFullName, setUserFullName] = useState();
    const [room, setRoom] = useState();
    const [chatHubConnection, setChatHubConnection] = useState();
    const [messages, setMessages] = useState([]);

    const joinRoom = async (user, room) => {
        try {
            const chatHubConnection = 
                new HubConnectionBuilder()
                    .withUrl(process.env.REACT_APP_API_URL + 'chat', { accessTokenFactory: () => cookies.get('token') })
                    .configureLogging(LogLevel.Information)
                    .build();
    
            chatHubConnection.on('ReceiveMessage', (user, message, datetime) => {
                setMessages(messages => messages.length < 50 ? 
                    [...messages, {user, message, datetime}].sort((a, b) => new Date(a.datetime) - new Date(b.datetime)) : 
                    [...messages.slice(1, messages.length - 1), {user, message, datetime}].sort((a, b) => new Date(a.datetime) - new Date(b.datetime)));
            });
    
            await chatHubConnection.start();
            setChatHubConnection(chatHubConnection);
            await chatHubConnection.invoke("JoinRoom", room);
            setUser(user);
        } catch (e) {
            console.log(e);  
            setUser();
        }
      }
    
      const sendMessage = async (user, room, message) => {
        try {
            await chatHubConnection.invoke("SendMessage", user, room, message);    
        } catch (e) {
            console.log(e);
        }
      }

      const closeConnection = async () => {
        try {
            await chatHubConnection.stop();
            setChatHubConnection();
            setMessages([]);
        } catch (e) {
            console.log(e);
        }
      }
    

      const logout = async () => {
        cookies.set('userName', '', {path: '/'});
        cookies.set('fullName', '', {path: '/'});
        cookies.set('token', '', {path: '/'});
        navigate('/');
    }

    useEffect(()=>{
        setUser(cookies.get('userName'));
        setUserFullName(cookies.get('fullName'));
    });

    return <div className='chatroom'>

            <div className="header">
                <h2 className="col-sm-9">Welcome to Stock Market Chat, {userFullName}</h2>
                <Button className="col-sm-3" variant='secondary' onClick={() => logout()}>Log Out</Button>
            </div>
            { !chatHubConnection
                ? <div className="chat-selection">
                    <h3>You will connect as: {user}</h3>
                    <div className="join-container">
                        <Form.Select aria-label="Default select example" onChange={e => setRoom(e.target.value)}>
                            <option>Select Room...</option>
                            <option value="Room1">Room 1 - Stocks</option>
                            <option value="Room2">Room 2 - Commodities</option>
                            <option value="Room3">Room 3 - Currencies</option>
                        </Form.Select>
                        <Button variant='primary' onClick={() => joinRoom(user, room)} disabled={!user || !room}>Join</Button>
                    </div>
                  </div>
                : <Chat messages={messages} sendMessage={sendMessage} user={user} room={room} closeConnection={closeConnection}/>
            }  
            </div>
}

export default Home;