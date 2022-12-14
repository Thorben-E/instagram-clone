import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import likeblack from '../assets/likeblack.png';
import { UserContext } from '../contexts';
import { db } from '../firebase';

// eslint-disable-next-line react/prop-types
const Post = ({ postIMG, caption, likes, username, postid }) => {
  const [likesAmount, setLikesAmount] = useState(likes);
  const [like, setLike] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState();
  const {user} = useContext(UserContext);

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
      <div className="posttopbar">
        <p>{username}</p>
        <p className='follow'>Follow</p>
      </div>
      <img src={postIMG} className='postimg' alt="" />
      <div className="postbottembar">
        <div className="likes">
          <img src={likeblack} onClick={onLikeClick} alt="img could not load" className="uploadIMG" />
          <p>{likesAmount}</p>
        </div>
        <div className="comments">
          <div className="nameAndCaption">
            <p><b>{username}:</b></p>
            <p>{caption}</p>
          </div>
          <ul>
            {comments.map((comment, index) => {
              return <li key={index} id={comment.userid}><b>{comment.username}:</b> {comment.comment}</li>;
            })} 
          </ul>
          <div>
            <input type="text" onChange={(event) => setCommentInput(event.target.value)} className='commentinput' id="commenttext" placeholder="Put comment here"/>
            <button onClick={postComment}>Post comment</button>    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
