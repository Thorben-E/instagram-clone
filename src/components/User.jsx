import { doc, getDoc, getDocs } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, storage } from '../firebase';
import { postsColRef } from '../firebase';
import ProfilePost from './ProfilePost';
import { v4 } from 'uuid';
import { UserContext } from '../contexts';

// eslint-disable-next-line react/prop-types
const User = () => {
  const {user} = useContext(UserContext);
  const location = useLocation();
  const { from } = location.state;
  // values for dom
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  // arrays for posts
  const [postsId, setPostsId] = useState([]);
  const [posts, setPosts] = useState([]);

  // initial load that adds postid's to array
  useEffect(() => {
    const wrapper = async () => {
      const userSnap = await getDoc(doc(db, 'Users', from));
      setUsername(userSnap.data().username);
      setName(userSnap.data().name);
      setBio(userSnap.data().bio);
      const createPostList = async () => {
        const querySnapshot = await getDocs(postsColRef);
        querySnapshot.forEach((doc) => {
          setPostsId(current => [...current, doc.id]);
        });
      };
      await createPostList();
    };
    wrapper();
    if (document.getElementById('searchBack') || document.getElementById('searchbar')) {
      if (document.getElementById('searchBack')) {
        document.getElementById('searchBack').style.display = 'none';
      } if (document.getElementById('searchbar')) {
        document.getElementById('searchbar').style.display = 'none';
      }
    }
  }, []);

  // runs after postsId is updated, sets all the posts inside array
  useEffect(() => {
    setPosts([]);
    const makeAuto = () => {
      postsId.forEach(postid => {
        listAll(ref(storage, postid)).then((response) => {
          response.items.forEach((item) => {
            getDownloadURL(item).then(async (url) => {
              let caption;
              let likes;
              let postuserid;
              const getLikesAndCaption = async () => {
                const docSnap = await getDoc(doc(db, 'posts', postid));
                caption = docSnap.data().caption;
                likes = docSnap.data().likes;
                postuserid = docSnap.data().userid;
              };
              await getLikesAndCaption();
              let username;
              const getUsername = async () => {
                const docSnap = await getDoc(doc(db, 'Users', postuserid));
                username = docSnap.data().username;
              };
              await getUsername();
              if (postuserid != user.uid) {
                setPosts(current => [...current, <ProfilePost key={v4()} postIMG={url} postid={postid} username={username} likes={likes} caption={caption}/>]);
              }
            });
          });
        });
      });
    };
    makeAuto();
  }, [postsId]);

  return (
    <div className='profileinfoWrap'>
      <div className="profileinfo">
        <> <div className='username'>
          <h2>{username}</h2>
        </div><div className='userinfo'><div className='name-bio'>
          <b><p>{name}</p></b>
          <p>{bio}</p>
        </div><div className='followers'>
          <p>2 messages</p>
          <p>4 followers</p>
          <p>5 following</p>
        </div></div> </>  
      </div>
      <div className='userPosts'>
        {posts}
      </div>
    </div>
  );
};

export default User;
