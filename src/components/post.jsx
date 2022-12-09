import React from 'react';

const Post = (usericon, mainIMG, likeicon, likes, name, caption) => {
  return (
    <div className="post">
      <div className="posttopbar">
        <img src={usericon} alt="" />
        <div>
          <p>Name</p>
          <p>Follow</p>
        </div>
      </div>
      <img src={mainIMG} alt="" />
      <div className="postbottembar">
        <img src={likeicon} alt="" />
        <p>{likes}</p>
        <p>{name} {caption}</p>
        <ul>
          {comments.map((comment) => {
            <li key={comment.user}>{comment.user}: {comment.text}</li>;
          })}    
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
