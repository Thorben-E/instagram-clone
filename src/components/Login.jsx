import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SingUp from './SignUp';
import { auth } from '../firebase';

const Login = () => {
  // login input and signup states
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null); 
  const [signup, setSignup] = useState(false);

  // change between signup and login
  const signupClick = () => {
    setSignup((curr) => curr === false ? true : false);
  };

  // login to firebase with input values
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      console.log(user);
    } catch(error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {signup ? <SingUp signupClick={signupClick} /> : <>
        <div className="loginForm-container">
          <div className="loginForm">
            <div className="loginFormTop">
              <h1 className="title">Instagram</h1>
              <input type="text" className='form-control' name="email" onChange={(event) => setEmail(event.target.value)} id="email" placeholder="email"/>
              <input type="password" className='form-control' name="password" onChange={(event) => setPassword(event.target.value)} id="password" placeholder="password" />
              <button type="submit" className='btn btn-primary' onClick={login}>Login</button>
            </div>
            <div className="loginFormBottom">
              <p>No account? <a onClick={signupClick} className='link'><b>Sign up here.</b></a></p>
            </div>
          </div>  
        </div> </>}
    </> 
  );
};

export default Login;
