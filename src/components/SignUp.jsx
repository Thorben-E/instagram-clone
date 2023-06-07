import React, { useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// eslint-disable-next-line react/prop-types
const SingUp = ({ signupClick }) => {
  // user inputs refs
  const emailRef = useRef();
  const passwordRef = useRef();

  // create user account
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth, 
        emailRef, 
        passwordRef
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
          <input type="text" name="email" className='form-control' ref={emailRef} id="email" placeholder="email"/>
          <input type="password" name="password" className='form-control' ref={passwordRef} id="password" placeholder="password" />
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
