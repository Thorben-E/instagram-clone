import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import { storage, db } from '../firebase';
import { postsColRef } from '../firebase';
import Post from './post';


// eslint-disable-next-line react/prop-types
const Homepage = ({ theme }) => {

  const [postsId, setPostsId] = useState([]);
  const [post, setPost] = useState('');

  

  useEffect(() => {
    const createPostList = async () => {
      const querySnapshot = await getDocs(postsColRef);
      querySnapshot.forEach((doc) => {
        setPostsId(current => [...current, doc.id]);
      });
      console.log(postsId);
      const docRef = doc(db, 'posts');
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
    };

    createPostList()
      .catch(console.error);
  }, []);

  const makeAuto = () => {
    postsId.forEach(postid => {
      listAll(ref(storage, postid)).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setPost(url);
          });
        });
      });
      return <Post theme={theme} postIMG={post} likes={''} caption={''}/>;
    });
  };
  
  return (
    <div className='homepagePosts'>
      <button onClick={makeAuto}>makeAuto</button> 
    </div>
  );
};

export default Homepage;
