// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/c1_navbar.css';
import Logo from '../img/bottle_aquarium_denkyu.png';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container">
                <Link to={'/'} className="navbar-brand">
                    <img src={Logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
                    {' '}StoryFish
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active"><Link to={'/'} className="nav-link">首頁</Link></li>
                        <li className="nav-item"><Link to={'/imageGallery'} className="nav-link">圖片庫</Link></li>
                        <li className="nav-item"><Link to={'/myInfo'} className="nav-link">我的資料</Link></li>
                        <li className="nav-item"><Link to={'/logOut'} className="nav-link">登出</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
