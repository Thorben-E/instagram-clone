import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import uploadIMG from '../assets/upload.svg';
import homeblack from '../assets/homeblack.png';
import searchblack from '../assets/searchblack.png';
import profileblack from '../assets/userblack.png';
import logoutblack from '../assets/logoutblack.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// eslint-disable-next-line react/prop-types
const Layout = () => {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (value.length > 0) {
      fetch('');
    }
  }, []);
  
  const logout = async () => {
    await signOut(auth);
  };  

  return (
    <>
      <nav>
        <ul>
          <li><h2 className="title">Instagram</h2></li>
          <li>
            <img src={homeblack} alt="img could not load" className="uploadIMG" /> 
            <Link to='/'>Homepage</Link> 
          </li>
          <li>
            <img src={searchblack} alt="img could not load" className="uploadIMG" /> 
            <input type="text" className="searchbar" onChange={(event) => setValue(event.target.value)} placeholder="Search..." value={value} />
          </li>
          <li>
            <img src={uploadIMG} alt="img could not load" className="uploadIMG" /> 
            <Link to='/upload'>Upload</Link>
          </li>
          <li>
            <img src={profileblack} alt="img could not load" className="uploadIMG" /> 
            <Link to='/profile' >Profile</Link>
          </li>
          <li onClick={logout}>
            <img src={logoutblack} alt="img could not load" className="uploadIMG" /> 
            Sign out
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
