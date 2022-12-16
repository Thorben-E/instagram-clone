import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage } from '../firebase';
import likeblack from '../assets/likeblack.png';
import likered from '../assets/likered.png';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts';
import { auth } from '../firebase';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Profile = () => {
  //get userid
  const {user} = useContext(UserContext);
  const location = useLocation();
  const { from } = location.state;
  const [userid, setUserid] = useState(from);
  //for changing user data
  const [username, setUsername] = useState();
  const [changeName, setChangeName] = useState('');
  const [changeBio, setChangeBio] = useState('');
  //for showing inputs to change user info
  const [changeUsername, setChangeUsername] = useState(true);
  //for showing posts 
  const [postList, setPostList] = useState([]);
  const [postListRefs, setPostListRefs] = useState([]);
  //enable and disable post popup
  const [showPost, setShowPost] = useState(false);
  //for post data
  const [postimg, setPostimg] = useState();
  const [postname, setPostname] = useState();
  const [likesAmount, setLikesAmount] = useState();
  const [like, setLike] = useState(false);
  const [postid, setPostid] = useState();
  const [commentInput, setCommentInput] = useState();
  const [comments, setComments] = useState();

  // set posts array and set username in User database
  useEffect(() => {
    const wrapper = async () => {
      await postListRefs.forEach((post) => {
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
        await passUsernameToUsers();
      }
    };
    wrapper();
    setUserid(from);
  }, []);

  // set postsRefs with userid
  useEffect(() => {
    const getFirestoreData = async () => {
      const docSnap = await getDoc(doc(db, 'Users', from));
      if (Object.keys(docSnap.data()).length > 1) {
        document.getElementById('firestoreData-name').textContent = `${docSnap.data().name}`;
        document.getElementById('firestoreData-bio').textContent = `${docSnap.data().bio}`;
        docSnap.data().posts.forEach((post) => {
          setPostListRefs((prev) => [...prev, post]);
        });
      } else {
        getFirestoreData();
      }
    };
    getFirestoreData();
  }, [userid]);

  // get url for posts
  useEffect(() => {
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
    getPosts();
  }, [postListRefs]);

  // on postimg click
  const goToPost = async (url) => {
    const getPostData = async () => {
      const postRef = doc(db, 'posts', url[1]);
      const postSnap = await getDoc(postRef);
      const userid = postSnap.data().userid;
      const userRef = doc(db, 'Users', userid);
      const userSnap = await getDoc(userRef);
      setComments([]);
      await postSnap.data().comments.forEach(comment => {
        setComments((prev) => [...prev, comment]);  
      });
      setLikesAmount(postSnap.data().likes);
      setPostname(userSnap.data().name);
      setPostid(url[1]);
    };
    await getPostData();
    setPostimg(url[0]); 
    setShowPost(true);
  };

  // on user data
  const onUpdate = () => {
    updateUserData();
    setChangeUsername(true);
  };
  
  const updateUserData = async () => {
    if (changeName != '') {
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

  // increment or decrement likes
  const onLikeClick = async () => {
    const docSnap = await getDoc(doc(db, 'posts', postid));
    let likes = docSnap.data().likes;
    if (like === false) {
      setLikesAmount(likes+1);
      setLike(true);
      setDoc(doc(db, 'posts', postid), { likes: likes+1 }, { merge: true });
    } else if (like === true) {
      setLikesAmount(likes-1);
      setLike(false);
      setDoc(doc(db, 'posts', postid), { likes: likes-1}, { merge: true });
    }
  };
  
  const postComment = async () => {
    const postRef = doc(db, 'posts', postid);
    const docSnap = await getDoc(doc(db, 'Users', user.uid));
    const commentUsername = docSnap.data().username;
    await updateDoc(postRef, {
      comments: arrayUnion({
        comment: commentInput,
        userid: user.uid,
        username: commentUsername 
      }) 
    });
    location.reload();
  };

  return (
    <div className='profileinfoWrap'>
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
        {postList.map((url, index) => {
          return <img key={index} onClick={() => goToPost(url)} className="postimg" src={url} />;
        })}
      </div>
      
      {showPost && <><div className='activePostdelete' onClick={() => setShowPost(false)}>X</div><div className='activePost'>
        <img src={postimg} alt="" className='activePostImg'/>
        <div className="right">
          <div className="rightTop">
            <p>{postname} </p>
          </div>
          <ul className='comments'>
            {comments.map((comment, index) => {
              return <li key={index} id={comment.userid}><b>{comment.username}:</b> {comment.comment}</li>;
            })} 
          </ul>
          <div className="rightBottom">
            <div className="likeContainer">
              {!like ? <img src={likeblack} onClick={onLikeClick} alt="img could not load" className="uploadIMG" /> : <img src={likered} onClick={onLikeClick} alt="img could not load" className="uploadIMG" />}
            </div>
            <div className="likes">
              <p>{likesAmount} likes</p>
            </div>
            <div className='commentAndButton'>
              <input type="text" onChange={(event) => setCommentInput(event.target.value)} name="comment" id="comment" placeholder='Add a comment...' />
              <button onClick={postComment}>comment</button>
            </div>
          </div>
        </div>
      </div></>
      }
    </div>
  );
};

export default Profile;