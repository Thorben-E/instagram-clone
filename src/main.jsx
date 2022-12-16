import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from './contexts';

import Login from './components/Login';
import Upload from './components/Upload';
import Profile from './components/Profile';
import Homepage from './components/Homepage';
import Layout from './components/Layout';
import User from './components/User';
import '../App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  // user logged in ? true : false
  const [user, setUser] = useState(true);
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user}}>
        {user ? <div className="App" >
          <Layout />
          <Routes>
            <Route index element={<Homepage />} />
            <Route path='login' element={<Login />} />
            <Route path='upload' element={<Upload />} />
            <Route path='user' element={<User />} />
            <Route path='profile' element={<Profile />} />
          </Routes>
        </div> : <Login />}
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
