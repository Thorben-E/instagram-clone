import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import { storage, db } from '../firebase';
import { postsColRef } from '../firebase';
import Post from './post';
import { v4 } from 'uuid';


// eslint-disable-next-line react/prop-types
const Homepage = () => {
  //arrays for showing posts
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    let postsids = [];
    const querySnapshot = await getDocs(postsColRef);
    querySnapshot.forEach((doc) => {
      postsids.push(doc.id);
    });
    postsids.forEach(postid => {
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
            setPosts(current => [...current, <Post key={v4()} postIMG={url} postid={postid} username={username} likes={likes} caption={caption}/>]);
          });
        });
      });
    });
  };

  // for creating array with postids 
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className='homepagePosts'>
      {posts}
    </div>
  );
};

export default Homepage;
