import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// eslint-disable-next-line react/prop-types
const SingUp = ({ signupClick }) => {
  // user inputs states
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  // create user account
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
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
      <div className="loginForm">
        <div className="loginFormTop">
          <h1 className="title">Instagram</h1>
          <p>Sign up to see pictures and video&apos;s from friends.</p>
          <input type="text" name="email" className='form-control' onChange={(event) => {
            setEmail(event.target.value);
          }} id="email" placeholder="email"/>
          <input type="password" name="password" className='form-control' onChange={(event) => {
            setPassword(event.target.value);
          }} id="password" placeholder="password" />
          <button className='btn btn-primary' onClick={register}>Sign up</button>
        </div>
        <div className="loginFormBottom">
          <p>Do you have an account? <a onClick={signupClick} className='link'><b>Login here.</b></a></p>
        </div>
      </div>
    </>
  );
};

export default SingUp;
