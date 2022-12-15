import React from 'react';
// eslint-disable-next-line react/prop-types
const Post = ({ postIMG }) => {
  return (
    <div className="profilePost">
      <img src={postIMG} className='profilePostIMG' alt="" />
    </div>
  );
};

export default Post;
