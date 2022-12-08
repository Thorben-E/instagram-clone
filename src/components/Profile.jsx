import { updateProfile } from "firebase/auth";
import React, { useContext, useState } from "react"
import { UserContext } from "../contexts";
import { auth } from "../firebase";

const Profile = () => {
  const [username, setUsername] = useState()
  const {user} = useContext(UserContext)

  const update = async () => {
    updateProfile(auth.currentUser, {
        displayName: username
    }).then(() => {
        location.reload();
        setTimout(() => {document.getElementById('functionLog').innerHTML = 'username updated. Refresh page to see update'}, 1000)
        setTimeout(() => {
          document.getElementById('functionLog').innerHTML = ''
        }, 5000)
    }).catch((error) =>
        console.log(error)
    );
  }
  return (
    <div>
        <div>email: {user.email}</div>
        <div>username: {user.displayName}</div>
        <input type="text" onChange={(event) => setUsername(event.target.value)} name="username" id="username" placeholder='username' />
        <button onClick={update} >Change username</button>
        <p id="functionLog"></p>
    </div>
  )
};

export default Profile;

/* const Profile = (profilelogo, name, messages, followers, following ) => {
  let messagesAmount;
  return (
    <div>
        <div className="profiletop">
            <img src={profilelogo} alt="" />
            <div>
                <h2>{name}</h2>
                <div>
                    <p>{messagesAmount}</p>
                    <p>{followers}</p>
                    <p>{following}</p> 
                </div>  
                <div>{bio}</div>
            </div>
        </div>
        <div>
          <h4>Messages</h4>
          {messages.map((message) => {
            <img src={message.img} alt="" />
            //onclick naar post
          })} 
        </div>
    </div>
  )
}; */