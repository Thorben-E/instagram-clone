import { addDoc, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import React, { useState, useContext, useEffect } from 'react';
import { postsColRef } from '../firebase';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import { db } from '../firebase';
import { UserContext } from '../contexts';

const Upload = () => {
  const {user} = useContext(UserContext);
  // values for post data
  const [caption, setCaption] = useState();
  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    if (document.getElementById('searchBack') || document.getElementById('searchbar')) {
      if (document.getElementById('searchBack')) {
        document.getElementById('searchBack').style.display = 'none';
      } if (document.getElementById('searchbar')) {
        document.getElementById('searchbar').style.display = 'none';
      }
    }
  });

  const upload = async () => {
    const userRef = doc(db, 'Users', user.uid);
    if (imageUpload == null) return;
    const docRef = await addDoc(postsColRef, {
      caption: caption,
      userid: user.uid,
      likes: 0,
      comments: []
    });
    await updateDoc(userRef, {
      posts: arrayUnion(docRef.id)
    });
    const imageRef = ref(storage, `${docRef.id}/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert('image uploaded');
    });
  };

  return (
    <div className="upload-container">
      <div className="upload">
        <h3>Upload a post!</h3>
        <input type="file" name="file" onChange={(event) => setImageUpload(event.target.files[0])} id="file" />
        <label htmlFor="title">Write a caption:</label>
        <input type="text" className='form-control uploadinput' onChange={(event) => setCaption(event.target.value)} name="caption" id="caption" />
        <button onClick={upload} className='btn btn-primary'>Upload</button>
      </div>
    </div>
  );
};

export default Upload;
