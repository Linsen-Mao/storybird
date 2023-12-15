// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/c1_navbar.css';
import Logo from '../img/bottle_aquarium_denkyu.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    let navigate = useNavigate();
    
    const Logout = async (e) => {
        e.preventDefault(); 
        const logoutURL = 'http://localhost:4000/logout';
        try {
            const response = await fetch(logoutURL, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // 告訴後端是json形式
                },
                body: JSON.stringify({}), // 前端傳給後端
            });
            if (!response.ok) { throw new Error('Register failed');}
            //
            console.log('logout successful.')
            navigate('/');
        }
        catch (error) {
            console.error('Error:', error.message);
        }
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container">
                <Link to={'/home'} className="navbar-brand">
                    <img src={Logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
                    {' '}Story Fish
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active"><Link to={'/home'} className="nav-link">Home</Link></li>
                        <li className="nav-item"><Link to={'/imageGallery'} className="nav-link">Image Gallery</Link></li>
                        <li className="nav-item"><Link to={'/myInfo'} className="nav-link">My Information</Link></li>
                        <li className="nav-item nav-link" onClick = {Logout}>Log out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
