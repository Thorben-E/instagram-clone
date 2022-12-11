import { updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { storage } from '../firebase';
import likeblack from '../assets/likeblack.png';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts';
import { auth } from '../firebase';
import { db } from '../firebase';

// eslint-disable-next-line react/prop-types
const Profile = () => {
  const [username, setUsername] = useState();
  const {user} = useContext(UserContext);
  const [postList, setPostList] = useState([]);
  const [changeUsername, setChangeUsername] = useState(true);
  const [postListRefs, setPostListRefs] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [activePost, setActivePost] = useState();
  const [postimg, setPostimg] = useState();
  const [postname, setPostname] = useState();

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
      document.getElementById('firestoreData-name').textContent = `${docSnap.data().name}`;
      document.getElementById('firestoreData-bio').textContent = `${docSnap.data().bio}`;
      docSnap.data().posts.forEach((post) => {
        setPostListRefs((prev) => [...prev, post]);
      });
    }
  };

  const goToPost = (url) => {
    setPostimg(url); 
    setPostname('frank');
    setShowPost(true);
  };

  const onChangeUsername = () => {
    update();
    setChangeUsername(true);
  };

  return (
    <div>
      <div className="profileinfo">
        {changeUsername ? 
          <> <div className='username'>
            <h2>{user.displayName}</h2>
            <button className='usernameBtn' onClick={() => setChangeUsername(false)}>Change username</button>
          </div><div className='userinfo'><div className='name-bio'>
            <b><p id='firestoreData-name'></p></b>
            <p id='firestoreData-bio'></p>
          </div><div className='followers'>
            <p>2 messages</p>
            <p>4 followers</p>
            <p>5 following</p>
          </div></div> </> : 
          <> <div className="username">
            <input type="text" onChange={(event) => setUsername(event.target.value)} name="username" id="username" placeholder='username' />
            <button className='usernameBtn' onClick={onChangeUsername} >Change username</button>
          </div><div className='userinfo'><div className='name-bio'>
            <b><p id='firestoreData-name'></p></b>
            <p id='firestoreData-bio'></p>
          </div><div className='followers'>
            <p>2 messages</p>
            <p>4 followers</p>
            <p>5 following</p>
          </div></div> </>}
      </div>
      <div className='posts'>
        {postList.map((url) => {
          return <img key={url} onClick={() => goToPost(url)} className="postimg" src={url} />;
        })}
      </div>
      {showPost && <div className='activePost'>
        <img src={postimg} alt="" className='activePostImg'/>
        <div className="right">
          <div className="rightTop">
            <p>{postname}</p>
            <p>Follow</p>
          </div>
          <div className="comments">
            <div>comments hier</div>
          </div>
          <div className="rightBottom">
            <img src={likeblack} alt="img could not load" className="uploadIMG" />
            <input type="text" name="comment" id="comment" />
          </div>
        </div>
      </div>
      }
      <button onClick={getFirestoreData}>getFirestoreData</button>
      <button onClick={getPosts}>getPosts</button>
    </div>
  );
};

export default Profile;