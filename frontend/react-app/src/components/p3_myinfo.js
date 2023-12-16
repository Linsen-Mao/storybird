// Myinfo.js
import '../css/p3_myInfo.css';
import MyGallery from './p3_1myGallery.js';
import React, { useEffect,useState } from 'react';
function MyInfo({userInfo}) {
    const {setAuthEmail, authEmail, setAuthUserName, setAuthUserID, authUserName, authUserID, token} = userInfo;
    console.log('ID:',authUserID);

    useEffect(() => {
        const fetchData = async () => {
            
            fetch(`http://localhost:4000/users/${authUserID}`, {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  
                    console.log(data);
                    //
                    const name = data.username;
                    const email = data.email;
                    setAuthUserName(name);
                    setAuthEmail(email);
                })
                .catch(error => {
                  console.error('Error:', error.message);
                });
        };

            fetchData();
    }, [authUserID]); // when authEmail change, tragger useEffect

    const myInfo = [authUserName, authEmail, require('../img/monster04.png')];
    return (
        <div id="myInfo" className="container mt-5">
            <h1 className="featurette-heading text-center mb-4">My Information</h1>
            <hr className="featurette-divider" />
            <div className="container">
                <div className="row align-items-stretch">
                    <div id='aboutMe' className='col-12 col-sm-4 col-md-3'>
                        <img src={myInfo[2]} alt='My Picture' className='img-fluid rounded-circle mb-5' />
                        <h5>Name：{myInfo[0]}</h5>
                        <p>Email：{myInfo[1]}</p>
                    </div>
                    <div id='myGallery' className='col-12 col-sm-8 col-md-9'>
                        <MyGallery userID = {{authUserID}}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyInfo;
