import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
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
  
  //firebase logout function
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
                {showSearch && results.map((result, index) => (
                  <Link to={'/user'} state={{ from: result[1]}} key={index} >{result[0]}</Link>
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
            <Link to='/profile' state={{ from: user.uid }} >Profile</Link>
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
