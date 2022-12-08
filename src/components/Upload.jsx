import React from "react"

const Upload = () => {

  const upload = () => {
    
  }
  return (
    <div className="upload-container">
        <div className="upload">
            <h3>Upload a post!</h3>
            <input type="file" name="file" id="file" />
            <label htmlFor="title">Write a caption:</label>
            <input type="text" name="caption" id="caption" />
            <button onClick={upload}>Upload</button>
        </div>
    </div>
  )
};

export default Upload;
