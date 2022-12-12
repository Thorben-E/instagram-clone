import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import uploadIMG from '../assets/upload.svg';
import homeblack from '../assets/homeblack.png';
import searchblack from '../assets/searchblack.png';
import profileblack from '../assets/userblack.png';
import logoutblack from '../assets/logoutblack.png';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// eslint-disable-next-line react/prop-types
const Layout = () => {
  const [userList, setUserList] = useState([]);
  const [value, setValue] = useState('');
  const [result, setResult] = useState();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        let userArr = [];
        querySnapshot.forEach((doc) => {
          userArr.push(doc.data().username);
          setUserList(userArr);
        });
      };
      fetchUsers();
      setResult([]);
      let searchQuery = value.toLowerCase();
      for (const key in userList) {
        let user = userList[key].toLowerCase();
        if (user.slice(0, searchQuery.length).indexOf(searchQuery) !== -1 ) {
          setResult(prevResult => {
            return [...prevResult, userList[key]];
          });
        }
      }
      console.log('useEffect fired');
      setShowSearch(true);
    }
  },[value]);
  
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
          <li className='search'>
            <img src={searchblack} alt="img could not load" className="uploadIMG" /> 
            <div className='searchAndOutput'>
              <input type="text" id='searchbar' className="searchbar" onChange={(event) => setValue(event.target.value)} placeholder="Search..." value={value} />
              {value && <div id='searchBack' className="searchBack">
                {showSearch && result.map((result, index) => (
                  <Link to='/user' user={result} key={index} >{result}</Link>
                ))}
              </div>}
            </div>
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
