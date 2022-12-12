import React from 'react';
import likeblack from '../assets/likeblack.png';

// eslint-disable-next-line react/prop-types
const Post = ({ postIMG, caption, likes, username }) => {
  return (
    <div className="post">
      <div className="posttopbar">
        <p>{username}</p>
        <p>Follow</p>
      </div>
      <img src={postIMG} className='postimg' alt="" />
      <div className="postbottembar">
        <div className="likes">
          <img src={likeblack} alt="img could not load" className="uploadIMG" />
          <p>{likes}</p>
        </div>
        <div className="comments">
          <p>{caption}</p>
          <ul>
            {/* {comments.map((comment) => {
              <li key={comment.user}>{comment.user}: {comment.text}</li>;
            })} */}    
          </ul>
          <div>
            <input type="text" className='commentinput' id="commenttext" placeholder="Put comment here"/>
            <button>Post comment</button>    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
