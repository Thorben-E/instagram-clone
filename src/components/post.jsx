import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import likeblack from '../assets/likeblack.png';
import { UserContext } from '../contexts';
import { db } from '../firebase';
import save from '../assets/save.png';
import likered from '../assets/likered.png';

// eslint-disable-next-line react/prop-types
const Post = ({ postIMG, caption, likes, username, postid }) => {
  const {user} = useContext(UserContext);
  const [likesAmount, setLikesAmount] = useState(likes);
  // like active ? red like : black like
  const [like, setLike] = useState(false);
  // array with all comments
  const [comments, setComments] = useState([]);
  // input for new comment
  const [commentInput, setCommentInput] = useState();

  // set post comments
  useEffect(() => {
    setComments([]);
    const wrap = async () => {
      const docSnap = await getDoc(doc(db, 'posts', postid));
      docSnap.data().comments.forEach(comment => {
        setComments((prev) => [...prev, comment]);  
      });
    };
    wrap();
  }, []);

  // increment or decrement like
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
    <div className="post">
      <div className="activePost-header">
        <p>{username} </p>
      </div>
      <img src={postIMG} className='postIMG' alt="" />
      <div className="activePost-likeContainer">
        {!like ? <img src={likeblack} onClick={onLikeClick} alt="img could not load" className="uploadIMG" /> : <img src={likered} onClick={onLikeClick} alt="img could not load" className="uploadIMG" />}
        <p>{likesAmount} likes</p>
      </div>
      <div className="comments">
        <p className='activePost-caption'><b>{username}: </b>{caption}</p>
        <ul className='activePost-comments'>
          {comments.map((comment, index) => {
            return <li className='commentli' key={index} id={comment.userid}><b>{comment.username}:</b> {comment.comment}</li>;
          })} 
        </ul> 
      </div>
      <div className='input-group'>
        <input type="text" className='form-control' onChange={(event) => setCommentInput(event.target.value)} name="comment" id="comment" placeholder='Add a comment...' />
        <button className='btn btn-primary' onClick={postComment}>comment</button>
      </div>
    </div>
  );
};

export default Post;
