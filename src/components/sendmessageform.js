import { Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

const SendMessageForm = ({ sendMessage, user, room }) => {
    const [message, setMessage] = useState('');

    return <Form
        onSubmit={e => {
            e.preventDefault();
            sendMessage(user, room, message);
            setMessage('');
        }}>
        <InputGroup>
            <FormControl className="col-sm-9" type="user" placeholder="message..."
                onChange={e => setMessage(e.target.value)} value={message} />
            <Button className="col-sm-3" variant="primary" type="submit" disabled={!message}>Send</Button>
        </InputGroup>
    </Form>
}

export default SendMessageForm;
