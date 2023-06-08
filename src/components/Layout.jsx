import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import instablack from '../assets/instablack.png';
import uploadIMG from '../assets/upload.svg';
import homeblack from '../assets/homeblack.png';
import searchblack from '../assets/searchblack.png';
import profileblack from '../assets/userblack.png';
import logoutblack from '../assets/logoutblack.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UserContext } from '../contexts';

// eslint-disable-next-line react/prop-types
const Layout = () => {
  const {user} = useContext(UserContext);

  //firebase logout function
  const logout = async () => {
    await signOut(auth);
  };

  const showLogo = () => {
    if (screen.width < 720) {
      return; 
    } else {
      return <li className='nav-item'>
        <img src={instablack} className="uploadIMG instalogo" alt="" />
        <h2 className="title nav-text">Instagram</h2>
      </li>;
    }
  };

  return (
    <>
      <nav>
        <ul>
          {showLogo()}
          <li className='nav-item'>
            <Link to='/' >
              <img src={homeblack} alt="img could not load" className="uploadIMG" />
              <h3 className='nav-text'>Homepage</h3>
            </Link> 
          </li>
          <li className='nav-item'>
            <Link to='/search' >
              <img src={searchblack} alt="img could not load" className="uploadIMG" />
              <h3 className='nav-text'>Search</h3>
            </Link> 
          </li>
          <li className='nav-item'>
            <Link to='/upload' >
              <img src={uploadIMG} alt="img could not load" className="uploadIMG" /> 
              <h3 className='nav-text'>Upload</h3>
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/profile' state={{ from: user.uid }} >
              <img src={profileblack} alt="img could not load" className="uploadIMG" /> 
              <h3 className='nav-text'>Profile</h3>
            </Link>
          </li>
          <li onClick={logout} className='nav-item'>
            <Link to="/">
              <img src={logoutblack} alt="img could not load" className="uploadIMG" /> 
              <h3 className='nav-text'>Sign out</h3>
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
