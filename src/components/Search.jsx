import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from '../contexts';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const {user} = useContext(UserContext);

  const filteredUsers = users.filter(user => {
    return user[1].toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    setUsers([]);
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'Users'));
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let userid = doc.id;
        let username = data.username;
        if (username == user.displayName) return;
        setUsers(prevArray => [...prevArray, [userid, username]]);
      });
    };
    getUsers();
  }, [query]);

  return (
    <div>
      <h2 className='searchTitle'>Search other users</h2>
      <input type="text" id='searchbar' className="searchbar" onChange={(event) => setQuery(event.target.value)} placeholder="input name here" value={query} />
      {filteredUsers.map((result, index) => (
        <Link to={'/user'} state={{ from: result[0]}} key={index} >{result[1]}</Link>
      ))}
    </div>);
  
};

export default Search;
