import { doc, getDoc, setDoc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage'; 
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, storage } from '../firebase';
import { postsColRef } from '../firebase';
import likeblack from '../assets/likeblack.png';
import ProfilePost from './ProfilePost';
import { v4 } from 'uuid';

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
  const [postsId, setPostsId] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setUserid(from);
    const wrapper = async () => {
      const userSnap = await getDoc(doc(db, 'Users', from));
      setUsername(userSnap.data().username);
      setName(userSnap.data().name);
      setBio(userSnap.data().bio);
      const createPostList = async () => {
        const querySnapshot = await getDocs(postsColRef);
        querySnapshot.forEach((doc) => {
          setPostsId(current => [...current, doc.id]);
        });
      };
      await createPostList();
    };
    wrapper();
  }, []);

  useEffect(() => {
    setPosts([]);
    const makeAuto = () => {
      postsId.forEach(postid => {
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
              setPosts(current => [...current, <ProfilePost key={v4()} postIMG={url} postid={postid} username={username} likes={likes} caption={caption}/>]);
            });
          });
        });
      });
    };
    makeAuto();
  }, [postsId]);

  useEffect(() => {
    const getFirestoreData = async () => {
      const docSnap = await getDoc(doc(db, 'Users', userid));
      docSnap.data().posts.forEach((post) => {
        setPostListRefs((prev) => [...prev, post]);
      });
    };
    getFirestoreData();
  }, [bio]);

  const goToPost = async (url) => {
    const getPostData = async () => {
      const postRef = doc(db, 'posts', url[1]);
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
      setPostid(url[1]);
    };
    await getPostData();
    setPostimg(url[0]); 
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
        userid: userid,
        username: commentUsername 
      }) 
    });
    location.reload();
  };

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
      <div className='userPosts'>
        {posts}
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
    </div>
  );
};

export default User;
