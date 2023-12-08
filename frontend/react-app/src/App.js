import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
///////////////// bootstrap /////////////////////
//////////////// react //////////////////
import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//////////////// components //////////////////
import Slide from './components/slide.js';
import LogInPage from './components/signin.js';
//
import Navbar from './components/c1_navbar.js';  
import Homepage from './components/p1_homepage.js';
import ImageGallery from './components/p2_imageGallery.js';
import Read from './components/p2_1read.js';
import MyInfo from './components/p3_myinfo.js';

//////////////////////////////////////////////
function App() {
  const [authEmail, setAuthEmail] = useState(null);
  const [authPassword, setAuthPassword] = useState(null);
  const [authUserName, setAuthUserName] = useState('Unknown');
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={
            <div className="app-box">
              <div className="carousel-box">
                <Slide />
              </div>
              <div className="signin-box" >
                <LogInPage setData = {{setAuthEmail, setAuthPassword, setAuthUserName}} />
              </div>
            </div>
          } />
          <Route path="/home" element={
            <div>
              <Navbar />
              <Homepage />
            </div> } />
          <Route path={'/imgGallery'} element={
            <div>
              <Navbar />
              <ImageGallery />
            </div>} />

          <Route path={'/read'} element={
          <div>
            <Navbar />
            <Read />
          </div>} />
          <Route path={'/myInfo'} element={
          <div>
            <Navbar />
            <MyInfo userInfo = {{authEmail, authUserName}}/>
          </div>} />

      </Routes>  
    </div>
  
  );
}
export default App;
