import { async } from '@firebase/util';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';

// eslint-disable-next-line react/prop-types
const User = () => {
  const [userid, setUserid] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
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
  
  const location = useLocation();
  const { from } = location.state;
  useEffect(() => {
    setUserid(from);
    const wrapper = async () => {
      const userSnap = await getDoc(doc(db, 'Users', from));
      setUsername(userSnap.data().username);
      setName(userSnap.data().name);
      setBio(userSnap.data().bio);
    };
    wrapper();
  }, []);

  return (
    <div>
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
      <div className='posts'>
        {postList.map((url, index) => {
          return <img key={index} onClick={() => goToPost(url)} className="postimg" src={url} />;
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
          <ul className='comments'>
            {comments.map((comment, index) => {
              return <li key={index} id={comment.userid}><b>{comment.username}:</b> {comment.comment}</li>;
            })} 
          </ul>
          <div className="rightBottom">
            <div className="likeContainer">
              <img src={likeblack} onClick={onLikeClick} alt="img could not load" className="uploadIMG" />
              <p>{likesAmount}</p>
            </div>
            <div className='commentAndButton'>
              <input type="text" onChange={(event) => setCommentInput(event.target.value)} name="comment" id="comment" />
              <button onClick={postComment}>comment</button>
            </div>
          </div>
        </div>
      </div>
      }
      <button onClick={getFirestoreData}>getFirestoreData</button>
    </div>
  );
};

export default User;
