// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/c1_navbar.css';
import Logo from '../img/monster01.png';
import C1 from '../img/monster02.png';
import C2 from '../img/monster05.png';
import C3 from '../img/monster07.png';
import C4 from '../img/monster11.png';
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
                    {' '}Story MONSTER
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active"><Link to={'/home'} className="nav-link">
                            <img src={C1} alt="photo" width="30" height="30" className="d-inline-block" />{' '}Home</Link></li>
                        <li className="nav-item"><Link to={'/imageGallery'} className="nav-link">
                            <img src={C2} alt="photo" width="30" height="30" className="d-inline-block" />{' '}Gallery</Link></li>
                        <li className="nav-item"><Link to={'/myInfo'} className="nav-link">
                            <img src={C3} alt="photo" width="30" height="30" className="d-inline-block" />{' '}MyInfo</Link></li>
                        <li className="nav-item nav-link" onClick = {Logout}>
                            <img src={C4} alt="photo" width="30" height="30" className="d-inline-block" />{' '}Log out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
