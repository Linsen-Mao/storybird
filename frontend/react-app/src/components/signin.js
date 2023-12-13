import '../App.css';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const Register = ({data}) => {

    let registerURL = 'http://localhost:4000/users';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    //// jump page
    const [loading, setLoading] = useState(false);
    const handleLoading = (newstate) => { setLoading(newstate); };
    let navigate = useNavigate();
    /// worng situation from login
    const [check, setCheck] = useState(false);
    const WrongCondition = (newstate) => { setCheck(newstate); };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        handleLoading(true);
        // console.log(username, email, password);
        try {
            const response = await fetch(registerURL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // 告訴後端是json形式
                },
                body: JSON.stringify({ username, password, email, profile: "This is a user profile." }), // 前端傳給後端
            });
            // 後端回傳資料
            const responData = await response.json();
            const id = responData.user.id;
            console.log(document.cookie);
            document.cookie = 'jwt=' + responData.token;
            console.log(responData);
            console.log(email, password, username);
            // if (responData.message === 'User created successfully'){
            // return data to app.js
            data.setEmail(email);
            data.setPassword(password);
            data.setUserID(id);
            //
            handleLoading(false);
            navigate('/home');

        } catch (error) {
            WrongCondition(true);
            handleLoading(false);
            console.error('Error:', error.message);
        }
        handleLoading(false);
      };

    return (
        <Form onSubmit = {handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter user name" 
                        value={username} onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>
                <br/><br/>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" 
                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <br/><br/>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                {check ? (<Form.Label disabled className="email-error" > email already used. </Form.Label>) : (<Form.Label></Form.Label>)}
                <br/><br/>
                
                {loading ? (
                    <Button id="loading" variant="outline-light" disabled className="formButton">
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        Loading...
                    </Button>
                    ) : (
                    <Button id="submitButton" variant="outline-light" type="submit" className="formButton" >
                        Submit
                    </Button>
                    )}
        </Form>  
    );
}
const SignIn = ({data}) => {
    /// backend api
    let signInURL = 'http://localhost:4000/login';
    /// render variable
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    /// loading icon
    const [loading, setLoading] = useState(false);
    const handleLoading = (newstate) => { setLoading(newstate); };
    /// worng situation from login
    const [check, setCheck] = useState(false);
    const WrongCondition = (newstate) => { setCheck(newstate); };
    /// jump page
    let navigate = useNavigate();
    /// form submit action
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        handleLoading(true);
        try {
            const response = await fetch(signInURL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // 告訴後端是json形式
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            // 後端回傳資料
            const responData = await response.json();
            if (responData.message === 'Login successful'){
                // data.setToken(responData.token)
                Cookie.set('jwt', responData.token, {expires: 7, path: '/'});

                // document.cookie = 'jwt=' + responData.token;
                console.log(document.cookie);
                // 傳回 function App中的useState Variables
                data.setEmail(email);
                data.setPassword(password);
                data.setUserID(responData.userId);
                // loading icon hide & warning word hide
                handleLoading(false);
                WrongCondition(false);
                // route to home page
                navigate('/home');
                // 
            } 
            
        } catch (error) {
            WrongCondition(true);
            handleLoading(false);
            console.error('Error:', error.message);
        }
        handleLoading(false);
      };
    
    return (
        <Form onSubmit = {handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" 
                        value={email} onChange={(e) => setEmail(e.target.value)}/>   
                </Form.Group>
                    <br/><br/>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" 
                        value={password} onChange={(e) => setPassword(e.target.value)}/>

                </Form.Group>
                {check ? (<Form.Label disabled className="email-error" > wrong email or wrong password. </Form.Label>) : (<Form.Label></Form.Label>)}
                <br/><br/>
                {loading ? (
                    <Button id="loading" variant="outline-light" disabled className="formButton">
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        Loading...
                    </Button>
                    ) : (
                    <Button id="submitButton" variant="outline-light" type="submit" className="formButton" >
                        Submit
                    </Button>
                    )}
                    
                
        </Form>  
    );
}
 // to change sign in or register
function LogInPage({setData}) {
    const [theme, setTheme] = useState('signin'); 
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const setEmail = setData.setAuthEmail;
    const setPassword = setData.setAuthPassword;
    const setUserID = setData.setAuthUserID;
    const setToken = setData.setToken;

    return (
        <div>
            {/* click and change */}
            <div className = "change-sign">
                <span className = "signButton" style={{ cursor: 'pointer' }} onClick={() => handleThemeChange('signin')}> SIGN IN </span>
                <span style={{display: 'inline-block',width:'50px', verticalAlign: 'middle'}} > | </span>
                <span className = "registerButton" style={{ cursor: 'pointer' }} onClick={() => handleThemeChange('register')}> REGISTER </span>
            </div>
            
            <br/><br/>
            <div>
                {theme === 'register' && (
                    <Register data = {{setEmail, setPassword, setUserID, setToken}}/>
                )}
                {theme === 'signin' && (
                    <SignIn data = {{setEmail, setPassword, setUserID, setToken }}/>
                )} 
            </div>
            
        </div>   
    );
}
export default LogInPage;

