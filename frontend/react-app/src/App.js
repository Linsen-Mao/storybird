import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
///////////////// bootstrap /////////////////////
//////////////// react //////////////////
import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookie from 'js-cookie';
//////////////// components //////////////////
import Slide from './components/slide.js';
import LogInPage from './components/signin.js';
//
import Navbar from './components/c1_navbar.js';  
import Homepage from './components/p1_homepage.js';
import ImageGallery from './components/p2_imageGallery.js';
import MyInfo from './components/p3_myinfo.js';
//
import Read from './components/read.js';

// alissa
import CreateStory from './components/edit/CreateStory.js'
import UploadImages from './components/edit/UploadImages.js'
import EditPage from './components/edit/EditPage.js';


//////////////////////////////////////////////
function App() {
  const [authEmail, setAuthEmail] = useState(null);
  const [authPassword, setAuthPassword] = useState(null);
  const [authUserName, setAuthUserName] = useState(null);

  const localID = localStorage.getItem('myKey') || null;
  const [authUserID, setAuthUserID] = useState(localID);

  const localToken = localStorage.getItem('mykey') || '';
  const [token, setToken] = useState(localToken);
  useEffect(() => {
    Cookie.set('jwt',token, {expires: 7, path: '/'});
    console.log('COOKIE: ',document.cookie);
  },[token]);

  useEffect(() => {
    localStorage.setItem('myKey', authUserID);
  },[authUserID]);
  return (
    <div className="App container">
      <Routes>
          <Route path="/" element={
            <div className="app-box">
              <div className="carousel-box">
                <Slide />
              </div>
              <div className="signin-box" >
                <LogInPage setData = {{setAuthEmail, setAuthPassword, setAuthUserName, setAuthUserID, setToken}} />
              </div>
            </div>
          } />
          <Route path="/home" element={
            <div>
              <Navbar />
              <Homepage />
            </div> } />
          <Route path="/imageGallery" element={
            <div>
              <Navbar />
              <ImageGallery />
            </div>} />

          <Route path="/story/read/:storyID" element={
          <div>
            <Navbar />
            <Read />
          </div>} />

          <Route path="/myInfo" element={
          <div>
            <Navbar />
            <MyInfo userInfo = {{setAuthEmail, authEmail, setAuthUserName, authUserName, authUserID, token}}/>
          </div>} />

          {/*changed by Alissa*/}
          <Route path= "/createStory" element={
          <div>
            <Navbar />
            <CreateStory />
          </div>} />  

          <Route path= "/uploadImages/:storyId" element={
          <div>
            <Navbar />
            <UploadImages />
          </div>} /> 

          <Route path= "/story/edit/:storyId" element={
          <div>
            <Navbar />
            <EditPage />
          </div>} /> 
          
      </Routes>  
    </div>
  
  );
}
export default App;

