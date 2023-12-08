import '../App.css';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const getUserName = ({data}) => {
    let getNameURL = 'http://localhost:4000/users/:id?'
    fetch(getNameURL)
    .then(response => {
        if (!response.ok) {
        throw new Error('cannot response.');
        }
        // 將回應轉換成 JSON
        return response.json();
    })
    .then(data => {
        console.log('return data', data);
        data.setAuthUserName(data);
    })
    .catch(error => {
        // 處理錯誤
        console.error('There was a problem with the fetch operation:', error.message);
    });
}
const Register = ({data}) => {

    let registerURL = 'http://localhost:4000/users';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
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
        console.log(userName, email, password);
        try {
            const response = await fetch(registerURL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // 告訴後端是json形式
                },
                body: JSON.stringify({ userName, email, password }), // 前端傳給後端
            });

            if (!response.ok) {
                WrongCondition(true);
                handleLoading(false);
                throw new Error('Register failed');
            }

            // 後端回傳資料
            const responData = await response.json();
            // return data to app.js
            data.Email(email);
            data.Password(password);
            data.UserName(userName);
            // store backend data
            setStatus(responData.status);
            setMessage(responData.message);

            //
            handleLoading(false);
            navigate('/home');

            } catch (error) {
            WrongCondition(true);
            console.error('Error:', error.message);
        }
      };

    return (
        <Form onSubmit = {handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter user name" 
                        value={userName} onChange={(e) => setUserName(e.target.value)}/>
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
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
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
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                WrongCondition(true);
                handleLoading(false);
                throw new Error('Login failed');
            }

            // 後端回傳資料
            const responData = await response.json();
            // 傳回 function App中的useState Variables
            data.setEmail(email);
            data.setPassword(password);

            getUserName({data});
            // loading icon hide & warning word hide
            handleLoading(false);
            WrongCondition(false);
            // store the backend data
            setMessage(responData.message);
            setToken(responData.token);
            // route to home page
            navigate('/home');
            // 
            console.log(responData.message);

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
    const [theme, setTheme] = useState('default'); 
    const [loading, setLoading] = useState(false);
    const handleLoading = (newstate) => { setLoading(newstate); };
    let navigate = useNavigate();

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };
    const setEmail = setData.setAuthEmail;
    const setPassword = setData.setAuthPassword;
    const setUserName = setData.setAuthUserName;
    return (
        <div>
            {/* click and change */}
            <div className = "change-sign">
                <span className = "signButton" style={{ cursor: 'pointer' }} onClick={() => handleThemeChange('default')}> SIGN IN </span>
                <span style={{display: 'inline-block',width:'50px', verticalAlign: 'middle'}} > | </span>
                <span className = "registerButton" style={{ cursor: 'pointer' }} onClick={() => handleThemeChange('register')}> REGISTER </span>
            </div>
            
            <br/><br/>
            <div>
                {theme === 'register' && (
                    <Register data = {{setEmail, setPassword, setUserName}}/>
                )}
                {theme === 'default' && (
                    <SignIn data = {{setEmail, setPassword, setUserName}}/>
                )} 
            </div>
            
        </div>   
    );
}
export default LogInPage;

