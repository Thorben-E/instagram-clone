import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  const [changeName, setChangeName] = useState('');
  const [changeBio, setChangeBio] = useState('');
  const {user} = useContext(UserContext);
  const [postList, setPostList] = useState([]);
  const [changeUsername, setChangeUsername] = useState(true);
  const [postListRefs, setPostListRefs] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [postimg, setPostimg] = useState();
  const [postname, setPostname] = useState();

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
    const passUsernameToUsers = async () => {
      setDoc(doc(db, 'Users', user.uid), {
        username: user.displayName
      }, { merge: true });
    };
    if (auth.currentUser) {
      passUsernameToUsers();
    }
  }, []);

  const getPosts = () => {
    postListRefs.forEach((post) => {
      listAll(ref(storage, post)).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setPostList((prev) => [...prev, [url, post]]);
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
    console.log(url[1]);

    const getPostData = async () => {
      const postRef = doc(db, 'posts', url[1]);
      const postSnap = await getDoc(postRef);
      const userid = postSnap.data().userid;
      const userRef = doc(db, 'Users', userid);
      const userSnap = await getDoc(userRef);
      setPostname(userSnap.data().name);
    }; 
    getPostData();
    setPostimg(url[0]); 
    setShowPost(true);
  };

  const onUpdate = () => {
    updateUserData();
    setChangeUsername(true);
  };
  
  const updateUserData = async () => {
    if (changeName != '') {
      console.log('it fires');
      const changename = async () => {
        await setDoc(doc(db, 'Users', user.uid), {
          name: changeName
        }, { merge: true });
      };
      try {
        changename();
      } catch(e) {
        console.error(e);
      }
    }

    if (changeBio != '') {
      const changebio = async () => {
        await setDoc(doc(db, 'Users', user.uid), {
          bio: changeBio
        }, { merge: true });
      };
      try {
        changebio();
      } catch(e) {
        console.error(e);
      }
    }
    
    updateProfile(auth.currentUser, {
      displayName: username
    }).then(() => {
      location.reload();
    }).catch((error) =>
      console.log(error)
    );
  };

  return (
    <div>
      <div className="profileinfo">
        {changeUsername ? 
          <> <div className='username'>
            <h2>{user.displayName}</h2>
            <button className='usernameBtn' onClick={() => setChangeUsername(false)}>Change Userdata</button>
          </div><div className='userinfo'><div className='name-bio'>
            <b><p id='firestoreData-name'></p></b>
            <p id='firestoreData-bio'></p>
          </div><div className='followers'>
            <p>2 messages</p>
            <p>4 followers</p>
            <p>5 following</p>
          </div></div> </> : 
          <> <div className="username">
            <input type="text" onChange={(event) => setUsername(event.target.value)} name="username" id="username" placeholder='username...' />
            <button className='usernameBtn' onClick={onUpdate} >Update data</button>
          </div><div className='userinfo'>
            <div className='name-bio'>
              <input type="text" name="name" id="name" onChange={(event) => setChangeName(event.target.value)} placeholder='name...' />
              <input type="text" name="bio" id="bio" onChange={(event) => setChangeBio(event.target.value)} placeholder='bio...' />
              <b><p id='firestoreData-name'></p></b>
              <p id='firestoreData-bio'></p>
            </div>
            <div className='followers'>
              <p>2 messages</p>
              <p>4 followers</p>
              <p>5 following</p>
            </div>
          </div> </>}
      </div>
      <div className='posts'>
        {postList.map((url) => {
          return <img key={url} onClick={() => goToPost(url)} className="postimg" src={url} />;
        })}
      </div>
      {showPost && <div className='activePost'>
        <img src={postimg} alt="" className='activePostImg'/>
        <div className="right">
          <div className='activePostdelete' onClick={() => setShowPost(false)}>X</div>
          <div className="rightTop">
            <p>{postname}</p>
            <p className='follow'>Follow</p>
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