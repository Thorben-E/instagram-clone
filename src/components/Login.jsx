import React, { useState } from "react"
import { signInWithEmailAndPassword } from 'firebase/auth'
import SingUp from "./SignUp";
import { auth } from "../firebase";

const Login = () => {
  // states
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null) 
  const [signup, setSignup] = useState(false)

  const signupClick = () => {
    setSignup((curr) => curr === false ? true : false)
  }

  const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth, 
                email, 
                password
            );
            console.log(user)
        } catch(error) {
            console.log(error.message);
        }
    }

  return (
    <>
    {signup ? <SingUp signupClick={signupClick} /> : <>
        <div className="loginForm-container">
            <div className="loginForm">
            <div className="loginFormTop">
                <h1 className="title">Instagram</h1>
                <input type="text" name="email" onChange={(event) => setEmail(event.target.value)} id="email" placeholder="email"/>
                <input type="password" name="password" onChange={(event) => setPassword(event.target.value)} id="password" placeholder="password" />
                <button type="submit" onClick={login}>Login</button>
            </div>
            <div className="loginFormBottom">
                <p>No account? <a onClick={signupClick}><b>Sign up here.</b></a></p>
            </div>
        </div>  
        </div> </>}
   </> 
  )
};

export default Login;
