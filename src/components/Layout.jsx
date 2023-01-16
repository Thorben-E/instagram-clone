import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import instablack from '../assets/instablack.png';
import uploadIMG from '../assets/upload.svg';
import homeblack from '../assets/homeblack.png';
import searchblack from '../assets/searchblack.png';
import profileblack from '../assets/userblack.png';
import logoutblack from '../assets/logoutblack.png';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../contexts';

// eslint-disable-next-line react/prop-types
const Layout = () => {
  const {user} = useContext(UserContext);
  // array for all users
  const [userList, setUserList] = useState([]);
  // searchbar input
  const [value, setValue] = useState('');
  // user matches with value in searchbar
  const [results, setResults] = useState();
  // divs with results from ^
  const [showSearch, setShowSearch] = useState(false);

  // shows users that match with value in searchbar
  useEffect(() => {
    if (value.length > 0) {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        let userArr = [];
        querySnapshot.forEach((doc) => {
          userArr.push([doc.data().username, doc.id]);
          setUserList(userArr);
        });
      };
      fetchUsers();
      setResults([]);
      let searchQuery = value.toLowerCase();
      for (const key in userList) {
        console.log(userList);
        let user = userList[key][0].toLowerCase();
        if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1 ) {
          setResults(prevResult => {
            return [...prevResult, userList[key]];
          });
        }
      }
      setShowSearch(true);
    }
  },[value]);

  const showsearch = () => {
    if (screen.width < 1200) {
      if (document.getElementById('searchbar').style.display === 'none') {
        document.getElementById('searchbar').style.display = 'block';
      } else {
        document.getElementById('searchbar').style.display = 'none';
      }
      document.getElementById('searchbar').classList.toggle('nav-text');
    } else {
      document.getElementById('searchbar').style.display = 'block';
    }
  };
  
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

  const showSearchbar = () => {
    if (screen.width > 1200) {
      return <li className='search nav-item'>
        <img src={searchblack} onClick={() => showsearch()} alt="img could not load" className="uploadIMG" /> 
        <input type="text" id='searchbar' className="searchbar nav-text" onChange={(event) => setValue(event.target.value)} placeholder="Search..." value={value} />
        {value && <div id='searchBack' className="searchBack">
          {showSearch && results.map((result, index) => (
            <Link to={'/user'} state={{ from: result[1]}} key={index} >{result[0]}</Link>
          ))}
        </div>}
      </li>;
    } else {
      return <li className='search nav-item'>
        <img src={searchblack} onClick={() => showsearch()} alt="img could not load" className="uploadIMG" /> 
        <div className='searchAndOutput'>
          <input type="text" id='searchbar' className="searchbar nav-text" onChange={(event) => setValue(event.target.value)} placeholder="Search..." value={value} />
          {value && <div id='searchBack' className="searchBack">
            {showSearch && results.map((result, index) => (
              <Link to={'/user'} state={{ from: result[1]}} key={index} >{result[0]}</Link>
            ))}
          </div>}
        </div>
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
          {showSearchbar()}
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
            <Link >
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
