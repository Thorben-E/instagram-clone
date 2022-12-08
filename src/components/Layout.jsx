import React from "react"
import { Link, Outlet } from "react-router-dom";
import ReactSwitch from "react-switch";
import uploadIMG from '../assets/upload.svg'
import uploadwhiteIMG from '../assets/uploadwhite.png'
import homeblack from '../assets/homeblack.png'
import homewhite from '../assets/homewhite.png'
import searchblack from '../assets/searchblack.png'
import searchwhite from '../assets/searchwhite.png'
import profileblack from '../assets/userblack.png'
import profilewhite from '../assets/userwhite.png'
import logoutblack from '../assets/logoutblack.png'
import logoutwhite from '../assets/logoutwhite.png'
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Layout = ({ toggleTheme, theme }) => {
    const logout = async () => {
        await signOut(auth);
    }  

    return (
        <>
            <nav>
                <ul>
                    <li><h2 className="title">Instagram</h2></li>
                    <li>
                        {theme === 'light' ? <img src={homeblack} alt="img could not load" className="uploadIMG" /> : <img alt="" src={homewhite} />}
                        <Link to='/'>Homepage</Link> 
                    </li>
                    <li>
                        {theme === 'light' ? <img src={searchblack} alt="img could not load" className="uploadIMG" /> : <img alt="" src={searchwhite} />}
                        <input type="text" className="searchbar" placeholder="Search..." />
                    </li>
                    <li>
                        {theme === 'light' ? <img src={uploadIMG} alt="img could not load" className="uploadIMG" /> : <img alt="" src={uploadwhiteIMG} />}
                        <Link to='/upload'>Upload</Link>
                    </li>
                    <li>
                        {theme === 'light' ? <img src={profileblack} alt="img could not load" className="uploadIMG" /> : <img alt="" src={profilewhite} />}
                        <Link to='/profile' >Profile</Link>
                    </li>
                    <li onClick={logout}>
                        {theme === 'light' ? <img src={logoutblack} alt="img could not load" className="uploadIMG" /> : <img alt="" src={logoutwhite} />}
                        Sign out
                    </li>
                </ul>
                <ul>
                   <li>
                        <label>Dark Mode</label>
                        <ReactSwitch onChange={toggleTheme} checked={theme === 'dark'} />
                    </li> 
                </ul>
            </nav>
            <Outlet />
        </>
    )
};

export default Layout;
