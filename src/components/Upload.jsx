import { addDoc, doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import React, { useState, useContext } from 'react';
import { postsColRef } from '../firebase';
import { storage } from '../firebase';
import { v4 } from 'uuid';
import { db } from '../firebase';
import { UserContext } from '../contexts';

const Upload = () => {
  const [caption, setCaption] = useState();
  const [imageUpload, setImageUpload] = useState(null);
  const {user} = useContext(UserContext);

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
        <input type="text" onChange={(event) => setCaption(event.target.value)} name="caption" id="caption" />
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
};

export default Upload;
