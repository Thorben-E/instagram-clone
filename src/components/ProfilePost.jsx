import React, { useContext, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import likeblack from '../assets/likeblack.png';
import likered from '../assets/likered.png';
import { UserContext } from '../contexts';

// eslint-disable-next-line react/prop-types
const Post = ({ postIMG, postid }) => {
  const {user} = useContext(UserContext);
  // true ? show popup : do not show popup
  const [showPost, setShowPost] = useState(false);
  //for post data
  const [postimg, setPostimg] = useState();
  const [postname, setPostname] = useState();
  const [likesAmount, setLikesAmount] = useState();
  const [comments, setComments] = useState();
  const [commentInput, setCommentInput] = useState();
  const [like, setLike] = useState(false);
  
  const goToPost = async () => {
    const getPostData = async () => {
      const postRef = doc(db, 'posts', postid);
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
    };
    await getPostData();
    await listAll(ref(storage, postid)).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setPostimg(url);
        });
      });
    });
    setShowPost(true);
  };

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

  return ( <>
    <div className="profilePost">
      <img src={postIMG} onClick={goToPost} className='profilePostIMG' alt="" />
    </div>
    {showPost && <><div className='activePost'>
      <div className="activePost-header">
        <p>{postname} </p>
        <p className='activePost-delete' onClick={() => setShowPost(false)}>X</p>
      </div>
      <img src={postimg} alt="" className='activePostImg'/>
      <div className="activePost-likeContainer">
        {!like ? <img src={likeblack} onClick={onLikeClick} alt="img could not load" className="uploadIMG" /> : <img src={likered} onClick={onLikeClick} alt="img could not load" className="uploadIMG" />}
        <p>{likesAmount} likes</p>
      </div>
      <ul className='activePost-comments'>
        {comments.map((comment, index) => {
          return <li key={index} id={comment.userid}><b>{comment.username}:</b> {comment.comment}</li>;
        })} 
      </ul>
      <div className='input-group'>
        <input type="text" className='form-control' onChange={(event) => setCommentInput(event.target.value)} name="comment" id="comment" placeholder='Add a comment...' />
        <button className='btn btn-primary' onClick={postComment}>comment</button>
      </div>
    </div></>
    } </>
  );
};

export default Post;
