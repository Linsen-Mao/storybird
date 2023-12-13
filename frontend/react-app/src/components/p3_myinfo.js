// Myinfo.js
import '../css/p3_myInfo.css';
import MyGallery from './p3_1myGallery.js';
import React, { useEffect,useState } from 'react';

function MyInfo({userInfo}) {
    const {authEmail, setAuthUserName, setAuthUserID, authUserName, authUserID, token} = userInfo;
    console.log(authUserID)
    // const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {

            fetch(`http://localhost:4000/users/${authUserID}`, {
                method: 'GET'})
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  
                    console.log(data);
                    //
                    const id = data.id;
                    const name = data.username;
                    setAuthUserID(id);
                    setAuthUserName(name);
                })
                .catch(error => {
                  console.error('Error:', error.message);
                });
        };

            fetchData();
    }, [authUserID]); // when authEmail change, tragger useEffect

    // useEffect(() => {
        
    //     if (userData) {
    //         console.log(userData);
    //         console.log(authEmail);
    //         const thisUser = userData.find(user => user.email === authEmail);
            
    //         if (thisUser) {
    //             console.log(thisUser);
    //         } 
    //         else {
    //             console.log('not found.');
    //         }
    //     }
    //     else{
    //         console.log('userData is null.')
    //     }
    // }, [userData, authEmail]);


    const myInfo = [authUserName, authEmail, require('../img/monster04.png')];
    return (
        <div id="myInfo" className="bg-light mt-5">
            <h1 className="featurette-heading text-center mb-4">我的資料</h1>
            <hr className="featurette-divider" />
            <div className="container">
                <div className="row align-items-stretch">
                    <div id='aboutMe' className='col-12 col-sm-4 col-md-3'>
                        <img src={myInfo[2]} alt='My Picture' className='img-fluid rounded-circle mb-5' />
                        <h5>姓名：{myInfo[0]}</h5>
                        <p>電子郵件：{myInfo[1]}</p>
                    </div>
                    <div id='myGallery' className='col-12 col-sm-8 col-md-9'>
                        <MyGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyInfo;
