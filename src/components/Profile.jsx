import { updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts';
import { auth } from '../firebase';
import { db } from '../firebase';

const Profile = () => {
  const [username, setUsername] = useState();
  const {user} = useContext(UserContext);
  const [postList, setPostList] = useState([]);
  const [changeUsername, setChangeUsername] = useState(true);
  const [postListRefs, setPostListRefs] = useState([]);

  const update = async () => {
    updateProfile(auth.currentUser, {
      displayName: username
    }).then(() => {
      location.reload();
    }).catch((error) =>
      console.log(error)
    );
  };

  useEffect(() => {
    postListRefs.forEach((post) => {
      listAll(post).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setPostList((prev) => [...prev, url]);
          });
        });
      });
    });
  }, []);

  const getPosts = () => {
    postListRefs.forEach((post) => {
      listAll(ref(storage, post)).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setPostList((prev) => [...prev, url]);
          });
        });
      });
    });
  };

  const getFirestoreData = async () => {
    console.log(user);
    const docSnap = await getDoc(doc(db, 'Users', user.uid));
    if (docSnap.exists()) {
      docSnap.data().posts.forEach((post) => {
        setPostListRefs((prev) => [...prev, post]);
        document.getElementById('firestoreData-name').textContent = `${docSnap.data().name}`;
        document.getElementById('firestoreData-bio').textContent = `${docSnap.data().bio}`;
      });
    }
  };

  const goToPost = () => {

  };

  const onChangeUsername = () => {
    update();
    setChangeUsername(false);
  };

  return (
    <div>
      <div className="profileinfo">
        {changeUsername ? <div className='username'>
          <h2>{user.displayName}</h2>
          <button>Change username</button>
        </div> : <div className="username">
          <input type="text" onChange={(event) => setUsername(event.target.value)} name="username" id="username" placeholder='username' />
          <button onClick={onChangeUsername} >Change username</button>
        </div> }
        <div>
          <p>2 messages</p>
          <p>4 followers</p>
          <p>5 following</p>
        </div>
        <div className='name-bio'>
          <b><p id='firestoreData-name'></p></b>
          <p id='firestoreData-bio'></p>
        </div>
      </div>
      {postList.map((url) => {
        return <img key={url} onClick={goToPost} className="postimg" src={url} />;
      })}
      
      <p id="functionLog"></p>
      <button onClick={getFirestoreData}>getFirestoreData</button>
      <button onClick={getPosts}>getPosts</button>
    </div>
  );
};

export default Profile;

/* const Profile = (profilelogo, name, messages, followers, following ) => {
  let messagesAmount;
  return (
    <div>
        <div className="profiletop">
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