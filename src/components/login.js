import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login(props) {

    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL + "api/authentication";
    const cookies = new Cookies();

    const [user, setUser] = useState();
    const [password, setPassword] = useState();

    const login = async() => {
        await axios.post(baseUrl + '/login/' + user + '/' + password)
            .then(response => {
                return response;
            }).then(response => {
                cookies.set('userName', response.data.loggedUser.userName, {path: '/'});
                cookies.set('fullName', response.data.loggedUser.firstName + ' ' + response.data.loggedUser.lastName, {path: '/'});
                cookies.set('token', response.data.token, {path: '/'});
                navigate('/home');
            })
            .catch(error => {
                window.alert(error);
            })
    }

    useEffect(()=>{
        if(cookies.get('userName')){
            navigate('/home');
        }
    },[]);

    return (
        <div className="login-container">
            <div className="form-group">
              <label>User: </label>
              <br />
              <input type="text" className="form-control" name="userName"
                onChange={e => setUser(e.target.value)}
              />
              <br />
              <label>Password: </label>
              <br />
              <input type="password" className="form-control" name="password"
                onChange={e => setPassword(e.target.value)}
              />
              <br />
              <button className="btn btn-primary" onClick={()=>login()} disabled={!user || !password}>Login</button>
          </div>
      </div>
    );
}

export default Login;