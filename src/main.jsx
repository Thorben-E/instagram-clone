import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeContext, UserContext } from './contexts';

import Login from './components/Login';
import Upload from './components/Upload';
import Profile from './components/Profile';
import Homepage from './components/Homepage';
import Layout from './components/Layout';
import '../App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(true);
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user}}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>  
          {user ? <div className="App" id={theme}>
            <Layout toggleTheme={toggleTheme} theme={theme}/>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path='login' element={<Login />} />
              <Route path='upload' element={<Upload />} />
              <Route path='profile' element={<Profile />} />
            </Routes>
          </div> : <Login />}
        </ThemeContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
