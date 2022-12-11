import React from 'react';
import likeblack from '../assets/likeblack.png';
import likewhite from '../assets/likewhite.png';

// eslint-disable-next-line react/prop-types
const Post = ({ theme, postIMG, caption, likes }) => {
  return (
    <div className="post">
      <div className="posttopbar">
        <div>
          <p>Name</p>
          <p>Follow</p>
        </div>
      </div>
      <img src={postIMG} alt="" />
      <div className="postbottembar">
        {theme === 'light' ? <img src={likeblack} alt="img could not load" className="uploadIMG" /> : <img alt="" src={likewhite} />}
        <p>{likes}</p>
        <p>{name} {caption}</p>
        <ul>
          {/* {comments.map((comment) => {
            <li key={comment.user}>{comment.user}: {comment.text}</li>;
          })} */}    
        </ul>
        <div>
          <input type="text" id="commenttext" placeholder="Put comment here"/>
          <button>Post comment</button>    
        </div> 
      </div>
    </div>
  );
};

export default Post;
